"""merge caracteres

Revision ID: cbca4d38f9cc
Revises: 128792c86e8b, 376701ff9451, 92c74682ba27
Create Date: 2025-06-10 16:10:29.529364

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cbca4d38f9cc'
down_revision: Union[str, None] = ('128792c86e8b', '376701ff9451', '92c74682ba27')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
