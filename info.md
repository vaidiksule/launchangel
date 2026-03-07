Below is a systematic master build plan you can give to your Anti-Gravity code editor (or any AI coding agent).
It is written as a clear implementation roadmap so the AI can follow it step-by-step without hallucinating architecture decisions.

I’ll structure it like a project specification markdown.

Autonomous Influencer Growth Agent
System Architecture & Implementation Plan

This project builds an Autonomous Influencer Marketing Agent powered by Gemini running on Vertex AI.

The system:

analyzes influencers

matches them with startups

generates optimized scripts

evaluates submitted videos

tracks performance

distributes payments automatically

Infrastructure will be deployed on Google Cloud Run.

Project Structure

The repository must follow this structure.

growth-agent/

frontend/
    package.json
    next.config.js
    src/
        app/
        components/
        lib/
        hooks/
        services/
        types/

backend/
    manage.py
    requirements.txt
    core/
    apps/
        users/
        influencers/
        campaigns/
        agents/
        analytics/

agents/
    influencer_analyzer/
    creator_matcher/
    script_generator/
    video_reviewer/
    performance_tracker/

workers/
    video_processing/
    hook_detection/

docs/
    architecture.md
    agents.md
Technology Stack
Frontend

Next.js

TailwindCSS

shadcn/ui

Framer Motion

Backend

Django

Django REST Framework

AI Layer

Gemini API through Vertex AI

Infrastructure

Cloud Run

Cloud Storage

Firestore / PostgreSQL

BigQuery (analytics)

Development Phases

We will implement the system in incremental phases.

Each phase must be fully functional before moving forward.

Phase 1 — Project Initialization
Step 1.1 Create Repository Structure

Create the folders:

frontend/
backend/
agents/
workers/
docs/
Step 1.2 Initialize Frontend

Inside frontend/ run:

npx create-next-app@latest frontend

Options:

TypeScript → Yes
App Router → Yes
Tailwind → Yes
ESLint → Yes
src directory → Yes

Install additional packages:

npm install axios
npm install framer-motion
npm install lucide-react

Add UI library:

npx shadcn-ui@latest init
Step 1.3 Initialize Backend

Inside backend/:

django-admin startproject core .

Install dependencies:

pip install django
pip install djangorestframework
pip install python-dotenv
pip install google-auth
pip install google-auth-oauthlib
pip install google-cloud-storage
pip install google-cloud-aiplatform

Create Django apps:

python manage.py startapp users
python manage.py startapp influencers
python manage.py startapp campaigns
python manage.py startapp analytics
python manage.py startapp agents
Phase 2 — Google Authentication

We do NOT use traditional login.

Authentication will use Google OAuth only.

Step 2.1 Create OAuth Credentials

In Google Cloud Console:

Create project

Enable APIs:

Google OAuth

Vertex AI

Create OAuth Client ID

Redirect URIs:

http://localhost:3000/api/auth/callback/google
Step 2.2 Frontend Google Login

Install:

npm install @react-oauth/google

Login button flow:

User clicks "Continue with Google"
↓
Google returns OAuth token
↓
Frontend sends token to backend
↓
Backend verifies token
↓
User session created
Step 2.3 Backend Token Verification

Use:

google.oauth2.id_token

Backend endpoint:

POST /api/auth/google

Process:

Receive ID token
Verify with Google
Extract email + name
Create user if not exists
Return JWT session token
Phase 3 — User Roles

Two user types exist:

Startup

Users who create campaigns.

Influencer

Users who create content.

Database Model
User
----
id
email
name
role (startup | influencer)
created_at

Influencer profile:

InfluencerProfile
----------------
user_id
instagram_handle
niche
followers
engagement_rate
audience_demographics
Phase 4 — Influencer Instagram Connection

Influencers connect their Instagram.

We store:

instagram_username
profile_picture
followers
bio
recent_posts
Step 4.1 Instagram Connect Flow

Frontend:

Connect Instagram Button
↓
User enters Instagram handle
↓
Backend fetches public data
Step 4.2 Data Extraction

Extract:

profile metadata

last 20 posts

engagement stats

Store in:

InfluencerContent
post_id
views
likes
comments
caption
video_url
timestamp
Phase 5 — Influencer Analysis Agent

Agent builds Creator Intelligence Profile.

Input:

top 20 videos
captions
comments
engagement metrics

Processing:

transcript extraction

hook detection

content style analysis

Output:

Creator Intelligence Report

Example:

Hook Style: Curiosity
Average Hook Length: 2.1 seconds
Common Topics: AI tools, productivity
Audience Age: 18-25
Phase 6 — Video Processing Pipeline

Video pipeline:

download video
↓
extract frames
↓
extract audio
↓
speech to text
↓
hook detection

Tools:

ffmpeg
Google Speech-to-Text
Gemini multimodal
Phase 7 — Campaign Creation

Startup dashboard allows creating campaign.

Input fields:

Product Name
Campaign Goal
Budget
Target Audience
Platforms

Example:

Product: AI Study Tool
Budget: $1000
Goal: 10k installs
Audience: Students
Phase 8 — Creator Matching Agent

Agent selects creators.

Inputs:

campaign niche
target audience
creator profiles
engagement data

Outputs:

creator ranking
predicted performance

Example:

Creator A → 85% success probability
Creator B → 72%
Creator C → 64%
Phase 9 — Script Generation Agent

Generates custom script based on:

creator style
campaign message
historical hooks

Example:

Hook:
"This AI tool just replaced my note-taking app."

Body:
Demo + explanation

CTA:
Download link in bio
Phase 10 — Creator Dashboard

Influencer sees:

assigned campaigns
script suggestions
submission deadlines
upload video
Phase 11 — Video Review Agent

When influencer uploads video:

AI evaluates:

hook strength
script similarity
product visibility
brand alignment

Output:

Video Score: 82%
Suggestions: Improve hook clarity
Phase 12 — Campaign Monitoring

System tracks:

views
engagement
clicks
conversions
Phase 13 — Smart Payment Agent

Payments calculated based on:

base pay
views
installs
engagement

Example:

Base: $50
+ $10 per 10k views
+ $20 per 1000 installs
Phase 14 — Analytics Dashboard

Startup dashboard displays:

campaign reach
ROI
creator performance
conversion metrics
Phase 15 — Deployment

Deploy services to Google Cloud.

Frontend:

Next.js → Cloud Run

Backend:

Django API → Cloud Run

AI services:

Vertex AI → Gemini

Storage:

Cloud Storage

Analytics:

BigQuery
Development Rules

The AI coding system must follow these rules:

Build one phase at a time

Each phase must be tested before next phase

Do not generate unnecessary abstractions

Maintain clean folder structure

Use TypeScript in frontend

Use Django REST API only

MVP Scope for Hackathon

For the hackathon demo implement only:

Google login

influencer onboarding

influencer analysis

campaign creation

creator matching

script generation

demo dashboard

Advanced features like payment automation can be simulated.