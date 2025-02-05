"""Database models."""

from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Integer, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Base class for SQLAlchemy models."""


class ClaimModel(Base):
    __tablename__ = 'Claims'

    claim_id = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_id: Mapped[int] = mapped_column(Integer)
    insurance_id: Mapped[int] = mapped_column(Integer)
    amount: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(Text)


class VehicleModel(Base):
    __tablename__ = 'Vehicles'

    vehicle_id = mapped_column(Integer, primary_key=True, autoincrement=True)
    vehicle_type: Mapped[str] = mapped_column(Text)
    make: Mapped[str] = mapped_column(Text)
    model: Mapped[str] = mapped_column(Text)
    production_year: Mapped[int] = mapped_column(Integer)
    color: Mapped[str] = mapped_column(Text)
    vin: Mapped[str] = mapped_column(Text)
    accident_history: Mapped[str] = mapped_column(Text)
    maintenance_status: Mapped[str] = mapped_column(Text)


class CustomerModel(Base):
    __tablename__ = 'Customers'

    customer_id = mapped_column(Integer, primary_key=True, autoincrement=True)
    first_name: Mapped[str] = mapped_column(Text)
    middle_names: Mapped[str] = mapped_column(Text)
    last_name: Mapped[str] = mapped_column(Text)
    full_name: Mapped[str] = mapped_column(Text)
    date_of_birth: Mapped[date] = mapped_column(Date)
    address: Mapped[str] = mapped_column(Text)
    age: Mapped[int] = mapped_column(Integer)
    number_of_accidents: Mapped[int] = mapped_column(Integer)
    accident_severity: Mapped[int] = mapped_column(Integer)
    accident_recency: Mapped[int] = mapped_column(Integer)
    customer_type: Mapped[str] = mapped_column(Text)


class InvoiceModel(Base):
    __tablename__ = 'Invoices'

    invoice_id = mapped_column(Integer, primary_key=True, autoincrement=True)
    vehicle_id = mapped_column(ForeignKey('Vehicles.vehicle_id'), nullable=False)
    customer_id = mapped_column(ForeignKey('Customers.customer_id'), nullable=False)
    date_start: Mapped[datetime] = mapped_column(DateTime)
    date_end: Mapped[datetime] = mapped_column(DateTime)
    currency: Mapped[str] = mapped_column(Text)
    total_amount: Mapped[float] = mapped_column(Float)
    payment_method: Mapped[str] = mapped_column(Text)
    iban: Mapped[str] = mapped_column(Text)


class InsuranceModel(Base):
    __tablename__ = 'Insurances'

    insurance_id = mapped_column(Integer, primary_key=True, autoincrement=True)
    insurance_type: Mapped[str] = mapped_column(Text)
    vehicle_id = mapped_column(ForeignKey('Vehicles.vehicle_id'), nullable=False)
    customer_id = mapped_column(ForeignKey('Customers.customer_id'), nullable=False)
    policy_number: Mapped[str] = mapped_column(Text)
    date_start: Mapped[datetime] = mapped_column(DateTime)
    date_end: Mapped[datetime] = mapped_column(DateTime)
    due_date: Mapped[datetime] = mapped_column(DateTime)
    amount: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(Text)
    frequency: Mapped[str] = mapped_column(Text)
    maximum_coverage = mapped_column(Float)
    deductible: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(Text)
    is_expired: Mapped[bool] = mapped_column(Boolean)


class ApplicationModel(Base):
    __tablename__ = 'Applications'

    application_id = mapped_column(Integer, primary_key=True, autoincrement=True)
    camunda_instance_id: Mapped[str] = mapped_column(Text)
    customer_id = mapped_column(ForeignKey('Customers.customer_id'), nullable=False)
    vehicle_id = mapped_column(ForeignKey('Vehicles.vehicle_id'), nullable=False)
    driver_risk: Mapped[float] = mapped_column(Float, nullable=True)
    vehicle_risk: Mapped[float] = mapped_column(Float, nullable=True)
    total_risk: Mapped[float] = mapped_column(Float, nullable=True)
    eligibility: Mapped[str] = mapped_column(Text, nullable=True)
    date_start: Mapped[datetime] = mapped_column(DateTime)
    date_end: Mapped[datetime] = mapped_column(DateTime)
