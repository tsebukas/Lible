from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Base, User
from app.security import get_password_hash

def create_test_user():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Kontrolli, kas kasutaja juba eksisteerib
        existing_user = db.query(User).filter(User.username == "admin").first()
        if existing_user:
            print("Testkasutaja on juba olemas")
            return

        # Loo uus testkasutaja
        test_user = User(
            username="admin",
            password_hash=get_password_hash("admin123"),
            is_local_auth=True,
            language="et"
        )
        db.add(test_user)
        db.commit()
        print("Testkasutaja loodud:")
        print("Kasutajanimi: admin")
        print("Parool: admin123")
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
