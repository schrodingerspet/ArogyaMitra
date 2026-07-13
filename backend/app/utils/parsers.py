import re
from typing import Union, Any

def safe_int(val: Any) -> Union[int, None]:
    if val is None:
        return None
    if isinstance(val, (int, float)):
        return int(val)
    match = re.search(r'\d+', str(val))
    if match:
        return int(match.group())
    return None

def safe_float(val: Any) -> Union[float, None]:
    if val is None:
        return None
    if isinstance(val, (int, float)):
        return float(val)
    match = re.search(r'\d+(?:\.\d+)?', str(val))
    if match:
        return float(match.group())
    return None
