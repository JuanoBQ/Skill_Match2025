"""empty message

Revision ID: 26c30f047e06
Revises: bfa4260f4e7c
Create Date: 2025-05-03 20:25:01.029315

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '26c30f047e06'
down_revision = 'bfa4260f4e7c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('profiles', schema=None) as batch_op:
        batch_op.drop_column('career')
        batch_op.drop_column('education')
        batch_op.drop_column('location')
        batch_op.drop_column('language')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('profiles', schema=None) as batch_op:
        batch_op.add_column(sa.Column('language', sa.TEXT(), nullable=True))
        batch_op.add_column(sa.Column('location', sa.TEXT(), nullable=True))
        batch_op.add_column(sa.Column('education', sa.TEXT(), nullable=True))
        batch_op.add_column(sa.Column('career', sa.TEXT(), nullable=True))

    # ### end Alembic commands ###
