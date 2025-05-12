import os
from flask_admin import Admin
from .models import db, User, Profile, Skill, FreelancerSkill, Project, Proposal, Payment ,ProjectSkill, Contact
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='Skill Match Admin', template_mode='bootstrap3')

    class UserModelView(ModelView):
        column_list = ('id', 'email', 'first_name', 'last_name', 'role', 'created_at', 'profile', 'projects', 'proposals')

    class ProfileModelView(ModelView):
        column_list = ('id', 'user_id', 'bio', 'profile_picture', 'hourly_rate', 'rating', 'skills')

    class SkillModelView(ModelView):
        column_list = ('id', 'name', 'freelancers')

    class FreelancerSkillModelView(ModelView):
        column_list = ('id', 'profile_id', 'skill_id', 'profile', 'skill')

    class ProjectModelView(ModelView):
        column_list = ('id', 'employer_id', 'title', 'description', 'category', 'budget', 'deadline', 'status', 'created_at', 'skill','proposals')

    class ProposalModelView(ModelView):
        column_list = ('id', 'project_id', 'freelancer_id', 'message', 'proposed_budget', 'status', 'created_at', 'project','skill', 'freelancer')
    class ProjectSkillModelView(ModelView):
        column_list = ('id', 'project_id', 'skill_id', 'project', 'skill')
    
    class ContactModelView(ModelView):
        column_list = ('id', 'user_id', 'contact_id', 'created_at')



    class PaymentModelView(ModelView):
        column_list = ('id', 'proposal_id', 'amount', 'status', 'created_at')

    admin.add_view(UserModelView(User, db.session))
    admin.add_view(ProfileModelView(Profile, db.session))
    admin.add_view(SkillModelView(Skill, db.session))
    admin.add_view(FreelancerSkillModelView(FreelancerSkill, db.session))
    admin.add_view(ProjectSkillModelView(ProjectSkill, db.session))
    admin.add_view(ProjectModelView(Project, db.session))
    admin.add_view(ProposalModelView(Proposal, db.session))
    admin.add_view(PaymentModelView(Payment, db.session))
    admin.add_view(ContactModelView(Contact, db.session))