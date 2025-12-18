from typing import List, Dict, Optional
import numpy as np

class Zone:
    def __init__(self, name: str, bounds: tuple, area: float, type: str):
        self.name = name
        self.bounds = bounds # (x_min, y_min, x_max, y_max)
        self.area = area
        self.type = type
        self.center = {
            'x': (bounds[0] + bounds[2]) / 2,
            'y': (bounds[1] + bounds[3]) / 2,
            'z': 0
        }

class Scenario:
    def __init__(self):
        self.zones: List[Zone] = []
        self.entities: List[dict] = []
        self.sport = 'UNKNOWN'

    def initialize(self, entities: List[dict]):
        """Populate initial entities"""
        pass

    def update(self, entities: List[dict], dt: float):
        """Update entity behaviors"""
        pass

class ScenarioManager:
    @staticmethod
    def create_scenario(sport: str, config: dict) -> Scenario:
        if sport == 'BASKETBALL':
            from ..sports.basketball import BasketballScenario
            return BasketballScenario(config)
        else:
            raise ValueError(f"Unknown sport: {sport}")
