from functools import wraps
from flask import request

def log_request(func):
    """Decorador para registrar solicitudes HTTP."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"[LOG] {request.method} {request.url} - IP: {request.remote_addr}")
        return func(*args, **kwargs)
    return wrapper