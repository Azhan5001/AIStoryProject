from __future__ import annotations

from dataclasses import dataclass, field
import json
from typing import Any, Dict, Iterable, Mapping, Optional, Sequence

from services.llm_client import LLMClient




def _format_content(content: Any) -> str:
    """
    Format content for LLM input or export.
    - str: returns as-is (stripped)
    - dict: pretty-prints as JSON
    - list of dicts: pretty-prints as JSON array
    - other lists: joins string representations
    """
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, dict):
        return json.dumps(content, ensure_ascii=False, indent=2)
    if isinstance(content, (list, tuple, set, Sequence)) and not isinstance(content, str):
        if all(isinstance(item, dict) for item in content):
            return "[\n" + ",\n".join(json.dumps(item, ensure_ascii=False, indent=2) for item in content) + "\n]"
        return "\n".join(str(item).strip() for item in content if str(item).strip())
    return str(content)

def _structure_input(label: str, content: Any) -> Optional[str]:
    formatted = _format_content(content)
    if not formatted:
        return None
    return f"{label}:\n{formatted}"


@dataclass
class LLMAgent:
    """Wraps the low-level LLM client and structures story inputs."""

    system_prompt: str
    agent_type: str # Indicate whether it is a story generation or internal/intermediate output agent
    thinking: bool = False  # Enable thinking mode for this agent
    thinking_effort: str = "medium"  # "low", "medium", or "high"
    llm_client: LLMClient = field(default_factory=LLMClient)
    
    def generate(self, payload: Mapping[str, Any]) -> Dict[str, Any]:
        """Compose messages from structured payload and invoke the underlying LLM."""
        structured_elements = [
            _structure_input(label.replace("_", " ").capitalize(), value)
            for label, value in payload.items()
        ]
        user_content = "\n\n".join(
            element for element in structured_elements if element
        )
        messages = []
        if self.system_prompt:
            messages.append({"role": "system", "content": self.system_prompt})
        if user_content:
            messages.append({"role": "user", "content": user_content})
        
        if self.thinking:
            result = self.llm_client.complete_with_thinking(messages, effort=self.thinking_effort)
            return {
                "text": result["text"].strip(),
                "thinking": result["thinking"],
                "structured": {key: payload[key] for key in payload},
                "system_prompt": self.system_prompt,
                "tokens": self.llm_client.last_usage,
            }
        else:
            response_text = self.llm_client.complete(messages)
            return {
                "text": response_text.strip(),
                "thinking": None,
                "structured": {key: payload[key] for key in payload},
                "system_prompt": self.system_prompt,
                "tokens": self.llm_client.last_usage,
            }
