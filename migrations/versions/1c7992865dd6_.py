"""empty message

Revision ID: 1c7992865dd6
Revises: 909e213ed416
Create Date: 2025-05-14 03:16:36.506727

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1c7992865dd6'
down_revision = '909e213ed416'
branch_labels = None
depends_on = None


def upgrade():
    
    op.create_table(
        'messages_tmp',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('sender_id', sa.Integer(), sa.ForeignKey('profiles.id', ondelete='CASCADE'), nullable=False),
        sa.Column('recipient_id', sa.Integer(), sa.ForeignKey('profiles.id', ondelete='CASCADE'), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
    )
    
    op.execute(
        "INSERT INTO messages_tmp (id, sender_id, recipient_id, content, timestamp) "
        "SELECT id, sender_id, recipient_id, content, timestamp FROM messages"
    )
    
    op.drop_table('messages')
    
    op.rename_table('messages_tmp', 'messages')


def downgrade():
 
    op.rename_table('messages', 'messages_tmp')
    op.create_table(
        'messages',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('sender_id', sa.Integer(), sa.ForeignKey('profiles.id'), nullable=False),
        sa.Column('recipient_id', sa.Integer(), sa.ForeignKey('profiles.id'), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
    )
    op.execute(
        "INSERT INTO messages (id, sender_id, recipient_id, content, timestamp) "
        "SELECT id, sender_id, recipient_id, content, timestamp FROM messages_tmp"
    )
    op.drop_table('messages_tmp')
