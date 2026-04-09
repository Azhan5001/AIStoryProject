# llm api module
import os
import time
from openai import OpenAI

OPENAI_MODEL = os.getenv('OPENAI_MODEL')

class LLMClient:
    '''
    Send prompts to LLM, return text responses.
    
    Knows: 
        - API Key (env)
        - API URL (env)
        - Model to use (env)
        
    Uses:
        - OpenAI Module
        
    Does:
        - Convert messages to OpenAI API format.
        - Generate and return response.
    
    Interface:
        complete(messages: list[dict]) -> str
        
    Reads from env:
        OPENAI_MODEL, OPENAPI_API_KEY, OPENAI_BASE_URL
    '''
    def __init__(self, model: str = OPENAI_MODEL):
        '''
        Initializing the OpenAI API and needed credentials
        '''
        self.model = model
        self.client = OpenAI(
            api_key=os.getenv('OPENAI_API_KEY')
        )
        # Token tracking
        self.last_usage = None  # Store last call's token usage
        self.total_usage = {
            "prompt_tokens": 0,
            "completion_tokens": 0,
            "total_tokens": 0,
        }
    
    def complete(self, messages: list[dict], thinking: bool = False) -> str:
        start_time = time.perf_counter()
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
        )
        elapsed = time.perf_counter() - start_time
        
        # Track tokens
        usage = response.usage
        if usage:
            self.last_usage = {
                "prompt_tokens": usage.prompt_tokens,
                "completion_tokens": usage.completion_tokens,
                "total_tokens": usage.total_tokens,
            }
            self.total_usage["prompt_tokens"] += usage.prompt_tokens
            self.total_usage["completion_tokens"] += usage.completion_tokens
            self.total_usage["total_tokens"] += usage.total_tokens
            print(f"[TOKENS] prompt={usage.prompt_tokens}, completion={usage.completion_tokens}, total={usage.total_tokens} (cumulative={self.total_usage['total_tokens']})")
        
        print(f"[TIMER] LLM Chat API call completed in {elapsed:.2f}s (model={self.model}, thinking=False)")
        return response.choices[0].message.content
    
    def complete_with_thinking(self, messages: list[dict], effort: str = "medium") -> dict:
        start_time = time.perf_counter()
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            reasoning_effort=effort,
        )
        elapsed = time.perf_counter() - start_time

        # Track tokens
        usage = response.usage
        if usage:
            self.last_usage = {
                "prompt_tokens": usage.prompt_tokens,
                "completion_tokens": usage.completion_tokens,
                "total_tokens": usage.total_tokens,
            }
            self.total_usage["prompt_tokens"] += usage.prompt_tokens
            self.total_usage["completion_tokens"] += usage.completion_tokens
            self.total_usage["total_tokens"] += usage.total_tokens
            print(f"[TOKENS] prompt={usage.prompt_tokens}, completion={usage.completion_tokens}, total={usage.total_tokens} (cumulative={self.total_usage['total_tokens']})")

        print(f"[TIMER] LLM Chat API call completed in {elapsed:.2f}s (model={self.model}, thinking={effort})")

        content = response.choices[0].message.content

        # content is a plain string when the model doesn't expose thinking blocks
        if isinstance(content, str):
            return {
                "text": content,
                "thinking": "",
            }

        # content is a list of typed blocks (thinking + text)
        text_content = ""
        thinking_content = ""
        for block in content:
            if block.type == "thinking":
                thinking_content += block.thinking
            elif block.type == "text":
                text_content += block.text

        return {
            "text": text_content,
            "thinking": thinking_content,
        }
        
    @staticmethod
    def _extract_response_text(response) -> str:
        '''Extract the output text from a Responses API response.
        
        The Responses API returns output as a list of items.
        We look for a "message" item with "output_text" content.
        '''
        for item in response.output:
            if item.type == "message":
                for content_part in item.content:
                    if content_part.type == "output_text":
                        return content_part.text
        return ""
    
    def get_usage_summary(self) -> dict:
        """Return cumulative token usage summary."""
        return {
            **self.total_usage,
            "model": self.model,
        }
    
    def reset_usage(self):
        """Reset cumulative token counters."""
        self.total_usage = {
            "prompt_tokens": 0,
            "completion_tokens": 0,
            "total_tokens": 0,
        }
        
    @staticmethod
    def _extract_thinking_content(response) -> str | None:
        '''Extract reasoning/thinking summary from a Responses API response.
        
        Reasoning items appear as separate output items with type "reasoning".
        '''
        for item in response.output:
            if item.type == "reasoning":
                if hasattr(item, 'summary') and item.summary:
                    parts = []
                    for s in item.summary:
                        if hasattr(s, 'text'):
                            parts.append(s.text)
                    if parts:
                        return "\n".join(parts)
        return None
    
    @staticmethod
    def _convert_for_thinking(messages: list[dict]) -> list[dict]:
        '''
        Convert system messages to developer messages for the Responses API.
        The Responses API uses "developer" role instead of "system".
        '''
        converted = []
        for msg in messages:
            if msg["role"] == "system":
                converted.append({
                    "role": "developer",
                    "content": msg["content"],
                })
            else:
                converted.append(msg)
        return converted