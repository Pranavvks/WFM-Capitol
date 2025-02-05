"""Pydantic validation of data objects."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class VehicleValidator(BaseModel):
    model_config = ConfigDict(extra='ignore')

    vehicle_id: str | None = Field(alias='id')
    car_type: str
    make: str
    model: str
    production_year: int
    color: str
    vin: str
    accident_history: str
    maintenance_status: str


class CustomerValidator(BaseModel):
    model_config = ConfigDict(extra='ignore')

    customer_id: int
    first_name: str
    middle_names: str
    last_name: str
    date_of_birth: datetime = Field(default_factory=datetime.min)
    age: int
    address: str
    number_of_accidents: int
    accident_severity: int
    accident_recency: int


class InternalApplicationValidator(BaseModel):
    vehicle: VehicleValidator
    customer: CustomerValidator


class ApplicationIndValidator(BaseModel):
    request_type: str
    vehicle: VehicleValidator
    customer: CustomerValidator


class ApplicationFleetValidator(BaseModel):
    request_type: str
    fleet: list[InternalApplicationValidator]


class ApplicationOutputValidator(BaseModel):
    vehicle_id: str
    vehicle_eligibility: str
    driver_eligibility: str


class ApplicationValidator(BaseModel):
    model_config = ConfigDict(extra='ignore')

    application_id: int
    camunda_instance_id: int
    customer: CustomerValidator
    vehicle: VehicleValidator
    date_start: datetime = Field(default_factory=datetime.now())
    date_end: datetime = Field(default_factory=datetime.now())


class InvoiceValidator(BaseModel):
    model_config = ConfigDict(extra='ignore')

    invoice_id: int
    vehicle: VehicleValidator
    customer: CustomerValidator
    date_start: datetime = Field(default_factory=datetime.now())
    date_end: datetime = Field(default_factory=datetime.now())
    currency: str = 'EUR'
    total_amount: float = 0.0
    payment_method: str | None = None
    iban: str | None = None


class InsuranceValidator(BaseModel):
    model_config = ConfigDict(extra='ignore')

    insurance_id: int
    customer: CustomerValidator
    vehicle: VehicleValidator
    insurance_type: str
    policy_number: str
    date_start: datetime = Field(default_factory=datetime.now())
    date_end: datetime = Field(default_factory=datetime.now())
    due_date: datetime = Field(default_factory=datetime.now())
    amount: float = 0.0
    currency: str = 'EUR'
    frequency: str
    maximum_coverage: float
    deductible: float
    status: str


class EligibilityValidator(BaseModel):
    driver_risk: float = 0
    vehicle_risk: float = 0
    total_risk: float = 0
    eligibility: str | None = None


class InstanceVariablesValidator(BaseModel):
    """A validator for variables of instance in Camunda."""

    instance_id: int
    application_id: int
    application: ApplicationValidator
    customer: CustomerValidator
    vehicle: VehicleValidator
    eligibility: EligibilityValidator
    invoice: InvoiceValidator
    insurance: InsuranceValidator
