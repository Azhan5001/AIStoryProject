from sqlalchemy.orm import Session
from sqlmodel import select
from orm.system_configuration import SystemConfiguration
from typing import Optional, List

def get_system_configurations(db: Session) -> List[SystemConfiguration]:
    '''Get all system configurations.
    Parameters:
        - None
    Return
        - list[SystemConfiguration]: list of system configuration records from the database'''
    return db.exec(select(SystemConfiguration)).all()

def get_system_configuration_by_id(db: Session, config_id: int) -> Optional[SystemConfiguration]:
    '''Get a single system configuration by its ID.
    
    Parameters:
        - None

    Return
        - Optional[SystemConfiguration]: system configuration record from the database or None if not found'''
    return db.get(SystemConfiguration, config_id)

def create_system_configuration(db: Session, config: SystemConfiguration) -> SystemConfiguration:
    '''Create a new system configuration.
    Parameters:
        - config (SystemConfiguration): The system configuration data to create.
    Return
        - SystemConfiguration: The created system configuration record from the database'''
    db_config = SystemConfiguration.model_validate(config)
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

def update_system_configuration_by_id(db: Session, config_id: int, config: SystemConfiguration) -> Optional[SystemConfiguration]:
    '''Update a system configuration by its ID.
    Parameters:
        - config_id (int): The ID of the system configuration to update.
        - config (SystemConfiguration): The system configuration data to update.
    Return
        - Optional[SystemConfiguration]: The updated system configuration record from the database or None if not found'''
    db_config = get_system_configuration_by_id(db, config_id)
    if not db_config:
        return None
    for key, value in config.model_dump(exclude_unset=True).items():
        setattr(db_config, key, value)
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

def delete_system_configuration_by_id(db: Session, config_id: int) -> bool:
    '''Delete a system configuration by its ID.
    Parameters:
        - config_id (int): The ID of the system configuration to delete.
    Return
        - bool: True if the system configuration was deleted, False if not found'''
    db_config = get_system_configuration_by_id(db, config_id)
    if not db_config:
        return False
    db.delete(db_config)
    db.commit()
    return True
