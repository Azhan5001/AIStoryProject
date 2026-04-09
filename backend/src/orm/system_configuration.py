from typing import Optional
from sqlmodel import SQLModel, Field

class SystemConfiguration(SQLModel, table=True):
    __tablename__ = "system_configuration"
    
    config_id: Optional[int] = Field(default=None, primary_key=True)
    config_value: str