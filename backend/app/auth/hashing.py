from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    # bcrypt has a 72-byte maximum password length
    return pwd_context.hash(password[:72]) 

def verify_password(plain, hashed):
    # bcrypt has a 72-byte maximum password length
    return pwd_context.verify(plain[:72], hashed)