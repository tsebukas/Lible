"""Add name field to holiday table

Revision ID: 001
Revises: 
Create Date: 2024-03-07
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Lisa name väli holiday tabelisse (esialgu nullable)
    op.add_column('holidays', sa.Column('name', sa.String(), nullable=True))
    
    # Täida olemasolevad read vaikeväärtusega
    op.execute("UPDATE holidays SET name = 'Nimeta püha' WHERE name IS NULL")
    
    # Muuda väli mitte-nullitavaks
    with op.batch_alter_table('holidays') as batch_op:
        batch_op.alter_column('name',
                            existing_type=sa.String(),
                            nullable=False)

def downgrade() -> None:
    # Eemalda name väli holiday tabelist
    op.drop_column('holidays', 'name')
