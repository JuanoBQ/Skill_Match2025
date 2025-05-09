from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Integer, ForeignKey, DateTime, Float, Text
from sqlalchemy import CheckConstraint, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from typing import List, Optional
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    first_name: Mapped[str] = mapped_column(String(80), nullable=True)
    last_name: Mapped[str] = mapped_column(String(80), nullable=True)
    role: Mapped[str] = mapped_column(String(20))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now())

    # Relaciones
    profile: Mapped[Optional["Profile"]] = relationship(
        "Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    projects: Mapped[List["Project"]] = relationship(
        "Project", back_populates="employer", cascade="all, delete-orphan")
    proposals: Mapped[List["Proposal"]] = relationship(
        "Proposal", back_populates="freelancer", cascade="all, delete-orphan")
    reviews_given:    Mapped[List["Review"]] = relationship(
        "Review", foreign_keys="[Review.reviewer_id]", back_populates="reviewer")
    reviews_received: Mapped[List["Review"]] = relationship(
        "Review", foreign_keys="[Review.reviewee_id]", back_populates="reviewee")


    def __repr__(self):
        return f"<User {self.email} - {self.role}>"

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# --- PERFIL DEL FREELANCER ---

class Profile(db.Model):
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), unique=True, nullable=False)
    bio: Mapped[Optional[str]] = mapped_column(Text)
    profile_picture: Mapped[Optional[str]] = mapped_column(String(255))
    hourly_rate: Mapped[Optional[float]] = mapped_column(Float)
    rating: Mapped[Optional[float]] = mapped_column(Float)
    industry: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    website: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    career: Mapped[Optional[str]] = mapped_column(Text)
    language: Mapped[Optional[str]] = mapped_column(Text)
    location: Mapped[Optional[str]] = mapped_column(Text)
    education: Mapped[Optional[str]] = mapped_column(Text)
    contacts: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)

    # Relaciones
    user: Mapped["User"] = relationship("User", back_populates="profile")
    skills: Mapped[List["FreelancerSkill"]] = relationship(
        "FreelancerSkill", back_populates="profile", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Profile UserID={self.user_id}>"

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "bio": self.bio,
            "profile_picture": self.profile_picture,
            "hourly_rate": self.hourly_rate,
            "rating": self.rating,
            "industry": self.industry,
            "website": self.website,
            "phone": self.phone,
            "career": self.career,
            "language": self.language,
            "location": self.location,
            "education": self.education,
            "skills": [fs.skill.serialize() for fs in self.skills if fs.skill is not None],
            "contacts" : self.contacts
        }


# --- SKILLS Y RELACIÓN MANY-TO-MANY ---


class Skill(db.Model):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    freelancers: Mapped[List["FreelancerSkill"]] = relationship(
        "FreelancerSkill", back_populates="skill")
    projects: Mapped[List["ProjectSkill"]] = relationship(
    "ProjectSkill", back_populates="skill", cascade="all, delete-orphan"
)

    def __repr__(self):
        return f"<Skill {self.name}>"

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }


class FreelancerSkill(db.Model):
    __tablename__ = "freelancer_skills"

    id: Mapped[int] = mapped_column(primary_key=True)
    profile_id: Mapped[int] = mapped_column(ForeignKey("profiles.id"))
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id"))

    profile: Mapped["Profile"] = relationship("Profile", back_populates="skills")
    skill: Mapped["Skill"] = relationship("Skill", back_populates="freelancers")

    def serialize(self):
        return {
            "id": self.id,
            "profile_id": self.profile_id,
            "skill": self.skill.serialize()
        }
class ProjectSkill(db.Model):
    __tablename__ = "project_skills"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id"))

    project: Mapped["Project"] = relationship("Project", back_populates="skills")
    skill: Mapped["Skill"] = relationship("Skill", back_populates="projects")  


    def serialize(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "skill": self.skill.serialize()
        }







# --- PROYECTOS Y PROPUESTAS ---


class Project(db.Model):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True)
    employer_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[Optional[str]] = mapped_column(String(100))
    budget: Mapped[Optional[float]] = mapped_column(Float)
    deadline: Mapped[Optional[datetime]] = mapped_column(DateTime)
    location: Mapped[Optional[str]] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(20), default="open")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    employer: Mapped["User"] = relationship("User", back_populates="projects")
    proposals: Mapped[List["Proposal"]] = relationship(
        "Proposal", back_populates="project", cascade="all, delete-orphan"
    )
    skills: Mapped[List["ProjectSkill"]] = relationship(
        "ProjectSkill", back_populates="project", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Project {self.title}>"

    def serialize(self):
        # Obtener el rating desde el perfil del empleador
        employer_profile = self.employer.profile if self.employer else None
        employer_rating = employer_profile.rating if employer_profile and employer_profile.rating is not None else None

        return {
            "id": self.id,
            "employer_id": self.employer_id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "budget": self.budget,
            "deadline": self.deadline.isoformat() if self.deadline else None,
            "location": self.location,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "skills": [ps.skill.serialize() for ps in self.skills],
            "employer_info": {
                "first_name": self.employer.first_name if self.employer else None,
                "last_name": self.employer.last_name if self.employer else None,
                "email": self.employer.email if self.employer else None,
                "rating": employer_rating
            },
            "proposals": [p.serialize_basic() for p in self.proposals]
        }

    def serialize_basic(self):
        return {
            "id": self.id,
            "title": self.title
        }



class Proposal(db.Model):
    __tablename__ = "proposals"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    freelancer_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    message: Mapped[str] = mapped_column(Text, nullable=False)
    proposed_budget: Mapped[Optional[float]] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    # Relaciones
    project: Mapped["Project"] = relationship("Project", back_populates="proposals")
    freelancer: Mapped["User"] = relationship("User", back_populates="proposals")
    payment: Mapped[Optional["Payment"]] = relationship("Payment", back_populates="proposal", uselist=False, cascade="all, delete-orphan")
    reviews: Mapped[List["Review"]] = relationship("Review", back_populates="proposal", cascade="all, delete-orphan")


    def __repr__(self):
        return f"<Proposal ProjectID={self.project_id} FreelancerID={self.freelancer_id}>"

    def serialize(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "freelancer_id": self.freelancer_id,
            "message": self.message,
            "proposed_budget": self.proposed_budget,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "freelancer": self.freelancer.serialize() if self.freelancer else None,
            "project": self.project.serialize_basic() if self.project else None
        }

    def serialize_basic(self):
        return {
            "id": self.id,
            "freelancer_id": self.freelancer_id,
            "status": self.status,
            "proposed_budget": self.proposed_budget
        }
    

class Payment(db.Model):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(primary_key=True)
    proposal_id: Mapped[int] = mapped_column(ForeignKey("proposals.id"), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    proposal: Mapped["Proposal"] = relationship("Proposal", back_populates="payment")

    def __repr__(self):
        return f"<Payment ID={self.id} ProposalID={self.proposal_id} Status={self.status}>"

    def serialize(self):
        return {
            "id": self.id,
            "proposal_id": self.proposal_id,
            "amount": self.amount,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
    

class Review(db.Model):
    __tablename__ = "reviews"
    __table_args__ = (
        UniqueConstraint('reviewer_id', 'proposal_id', name='uix_reviewer_proposal'),
        CheckConstraint('rating >= 1 AND rating <= 5', name='ck_rating_range'))

    id: Mapped[int] = mapped_column(primary_key=True)
    reviewer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    reviewee_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    proposal_id: Mapped[int] = mapped_column(ForeignKey("proposals.id"), nullable=False)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    reviewer = relationship("User", foreign_keys=[reviewer_id])
    reviewee = relationship("User", foreign_keys=[reviewee_id])
    proposal = relationship("Proposal", back_populates="reviews")