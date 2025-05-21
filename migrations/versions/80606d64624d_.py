"""empty message

Revision ID: 80606d64624d
Revises: 6192f3157d84
Create Date: 2025-05-15 18:19:55.122011

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '80606d64624d'
down_revision = '6192f3157d84'
branch_labels = None
depends_on = None


def upgrade():
    # Agrega la columna is_read con valor por defecto False
    op.add_column(
        'messages',
        sa.Column(
            'is_read',
            sa.Boolean(),
            nullable=False,
            server_default=sa.false()
        )
    )


def downgrade():
    # Elimina la columna is_read
    op.drop_column('messages', 'is_read')