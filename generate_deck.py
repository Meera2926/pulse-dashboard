"""
Pulse Pitch Deck Generator
Generates a dark-themed, 16:9 pitch deck presentation for Pulse.
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck(filename="Pulse_Pitch_Deck.pptx"):
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    # Palette
    BG_COLOR = RGBColor(11, 15, 25)       # Deep slate navy
    CARD_BG = RGBColor(19, 26, 43)        # Card background
    ACCENT_CYAN = RGBColor(6, 182, 212)   # Cyan / Teal
    ACCENT_PURPLE = RGBColor(139, 92, 246)# Violet
    ACCENT_EMERALD = RGBColor(16, 185, 129)# Emerald Green
    TEXT_LIGHT = RGBColor(248, 250, 252)  # White/Slate 50
    TEXT_MUTED = RGBColor(148, 163, 184)  # Slate 400
    
    blank_layout = prs.slide_layouts[6]
    
    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background()
        return bg

    def add_header(slide, tag, title, subtitle=None):
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.6), Inches(11.7), Inches(1.4))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        # Tag
        p0 = tf.paragraphs[0]
        p0.text = tag.upper()
        p0.font.bold = True
        p0.font.size = Pt(11)
        p0.font.color.rgb = ACCENT_CYAN
        p0.space_after = Pt(4)
        
        # Title
        p1 = tf.add_paragraph()
        p1.text = title
        p1.font.bold = True
        p1.font.size = Pt(28)
        p1.font.color.rgb = TEXT_LIGHT
        
        if subtitle:
            p2 = tf.add_paragraph()
            p2.text = subtitle
            p2.font.size = Pt(14)
            p2.font.color.rgb = TEXT_MUTED
            p2.space_before = Pt(4)

    # ----------------------------------------------------
    # SLIDE 1: COVER
    # ----------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)
    
    tb1 = s1.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(11.3), Inches(3.5))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    
    p = tf1.paragraphs[0]
    p.text = "PULSE"
    p.font.bold = True
    p.font.size = Pt(56)
    p.font.color.rgb = ACCENT_CYAN
    
    p2 = tf1.add_paragraph()
    p2.text = "Unified Real-Time Event Intelligence, Cross-Channel Attribution & Predictive Demand Forecasting"
    p2.font.size = Pt(22)
    p2.font.color.rgb = TEXT_LIGHT
    p2.space_before = Pt(12)
    
    p3 = tf1.add_paragraph()
    p3.text = "Empowering modern product, growth, and RevOps teams to act on customer behavior before it becomes history."
    p3.font.size = Pt(15)
    p3.font.color.rgb = TEXT_MUTED
    p3.space_before = Pt(16)
    
    p4 = tf1.add_paragraph()
    p4.text = "Presenter: Pulse Engineering Team | Public Open-Source Initiative"
    p4.font.size = Pt(12)
    p4.font.color.rgb = ACCENT_PURPLE
    p4.space_before = Pt(28)

    # ----------------------------------------------------
    # SLIDE 2: THE PROBLEM
    # ----------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "The Critical Problem", "High Latency & Fragmented Customer Reality", "Traditional enterprise data analytics pipelines act as rearview mirrors.")
    
    cards_data = [
        ("24h - 48h Latency", "Attribution Lag", "Marketers make ad allocation decisions based on stale batch ETL jobs, burning 20%+ of marketing budgets on underperforming channels."),
        ("Siloed Tools", "Disjointed Journey", "Web traffic (GA4), product events (Mixpanel), and sales pipelines (CRM) live in isolated data silos with no cohesive live correlation."),
        ("Reactive Defense", "Blind Churn", "Customer retention interventions occur only after accounts cancel, missing critical 14-day early degradation indicators.")
    ]
    
    for i, (metric, head, desc) in enumerate(cards_data):
        x = Inches(0.8 + i * 4.0)
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.5), Inches(3.7), Inches(4.0))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = ACCENT_CYAN if i == 0 else ACCENT_PURPLE
        card.line.width = Pt(1.5)
        
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.3)
        ctf.margin_top = Inches(0.4)
        ctf.margin_right = Inches(0.3)
        
        cp1 = ctf.paragraphs[0]
        cp1.text = metric
        cp1.font.bold = True
        cp1.font.size = Pt(24)
        cp1.font.color.rgb = ACCENT_CYAN if i == 0 else (ACCENT_EMERALD if i == 1 else ACCENT_PURPLE)
        
        cp2 = ctf.add_paragraph()
        cp2.text = head
        cp2.font.bold = True
        cp2.font.size = Pt(16)
        cp2.font.color.rgb = TEXT_LIGHT
        cp2.space_before = Pt(8)
        
        cp3 = ctf.add_paragraph()
        cp3.text = desc
        cp3.font.size = Pt(13)
        cp3.font.color.rgb = TEXT_MUTED
        cp3.space_before = Pt(12)

    # ----------------------------------------------------
    # SLIDE 3: WHO EXPERIENCES THIS
    # ----------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "Market Personas", "Who Suffers From This Problem and Why It Matters", "Spanning core functional leaders across B2B SaaS, D2C, and Fintech.")
    
    personas = [
        ("Growth & Performance Leads", "Responsible for $50k-$2M+ monthly ad spend across Meta, Google, TikTok, LinkedIn.", "Suffers from inaccurate ROAS and delayed spend reallocations during volatile campaign shifts."),
        ("Product & Design Teams", "Responsible for onboarding conversion and feature activation.", "Suffers from delayed visibility into funnel abandonment and UX friction points."),
        ("RevOps & Executive Leadership", "Responsible for Net Revenue Retention (NRR) and ARR forecasting.", "Suffers from unexpected customer churn and unpredictable macro demand swings."),
        ("Platform & Data Engineers", "Responsible for telemetry pipelines and warehouse scalability.", "Suffers from maintaining fragile batch ETL scripts, high warehouse compute costs, and alert fatigue.")
    ]
    
    for i, (title, role, pain) in enumerate(personas):
        row = i // 2
        col = i % 2
        x = Inches(0.8 + col * 6.0)
        y = Inches(2.3 + row * 2.3)
        
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.7), Inches(2.0))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.fill.background()
        
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.25)
        ctf.margin_top = Inches(0.2)
        ctf.margin_right = Inches(0.25)
        
        p1 = ctf.paragraphs[0]
        p1.text = title
        p1.font.bold = True
        p1.font.size = Pt(16)
        p1.font.color.rgb = ACCENT_CYAN
        
        p2 = ctf.add_paragraph()
        p2.text = "Role: " + role
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_LIGHT
        p2.space_before = Pt(4)
        
        p3 = ctf.add_paragraph()
        p3.text = "Pain Point: " + pain
        p3.font.size = Pt(11)
        p3.font.color.rgb = TEXT_MUTED
        p3.space_before = Pt(4)

    # ----------------------------------------------------
    # SLIDE 4: THE SOLUTION - PULSE
    # ----------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "The Solution", "Pulse: Next-Gen Event Telemetry & Predictive Analytics", "A unified glassmorphic command center transforming telemetry into immediate action.")
    
    features = [
        ("Live Ingestion & Simulation", "High-throughput synthetic event generation capturing views, cart actions, checkout completions, and renewals across 6 channels in real-time."),
        ("Predictive Demand Wave", "Fourier-smoothed polynomial projection predicting upcoming 24-hour demand curves with statistical confidence bands."),
        ("Dynamic Heatmap Attribution", "Multi-touch conversion intensity matrix illuminating high-affinity user segments and channel efficiency."),
        ("Early Churn Radar", "Automated customer health scoring tracking declining engagement frequency and negative sentiment shifts.")
    ]
    
    for i, (head, desc) in enumerate(features):
        x = Inches(0.8 + i * 2.95)
        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.5), Inches(2.8), Inches(4.2))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = ACCENT_PURPLE
        card.line.width = Pt(1)
        
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.2)
        ctf.margin_top = Inches(0.3)
        ctf.margin_right = Inches(0.2)
        
        p1 = ctf.paragraphs[0]
        p1.text = f"0{i+1}"
        p1.font.bold = True
        p1.font.size = Pt(28)
        p1.font.color.rgb = ACCENT_CYAN
        
        p2 = ctf.add_paragraph()
        p2.text = head
        p2.font.bold = True
        p2.font.size = Pt(15)
        p2.font.color.rgb = TEXT_LIGHT
        p2.space_before = Pt(8)
        
        p3 = ctf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(12)
        p3.font.color.rgb = TEXT_MUTED
        p3.space_before = Pt(10)

    # ----------------------------------------------------
    # SLIDE 5: ARCHITECTURE & TECH STACK
    # ----------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "Architecture", "Built on Modern, High-Performance Web Standards", "Engineered for 60fps interactivity, modular scaling, and zero telemetry overhead.")
    
    tech_stacks = [
        ("Next.js 16 (Turbopack App Router)", "Server-side rendering paired with static optimization for instantaneous route transitions and minimal bundle payloads."),
        ("Tailwind CSS v4 & Glassmorphism", "Bespoke cyber-aesthetic with backdrop filters, gradient borders, and sleek dark mode ergonomics."),
        ("Zustand & Reactive State Store", "Decoupled global state managing high-frequency live events, pause/resume simulation, and user filters without React re-render lag."),
        ("Recharts & Framer Motion", "Smooth hardware-accelerated charting and fluid transition micro-animations across all analytical views.")
    ]
    
    for i, (title, desc) in enumerate(tech_stacks):
        y = Inches(2.3 + i * 1.15)
        box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.7), Inches(0.95))
        box.fill.solid()
        box.fill.fore_color.rgb = CARD_BG
        box.line.color.rgb = ACCENT_CYAN if i % 2 == 0 else ACCENT_PURPLE
        box.line.width = Pt(1)
        
        btf = box.text_frame
        btf.word_wrap = True
        btf.margin_left = Inches(0.3)
        btf.margin_top = Inches(0.15)
        
        p1 = btf.paragraphs[0]
        p1.text = title
        p1.font.bold = True
        p1.font.size = Pt(15)
        p1.font.color.rgb = ACCENT_EMERALD if i % 2 == 0 else ACCENT_CYAN
        
        p2 = btf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_LIGHT

    # ----------------------------------------------------
    # SLIDE 6: MARKET OPPORTUNITY & TAM
    # ----------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "Market Opportunity", "Riding the Wave of Real-Time Data & Modern CDP Sprawl", "Consolidating the multi-billion dollar MarTech and Product Analytics sectors.")
    
    tam_metrics = [
        ("$32.5 Billion", "Customer Data Platform (CDP)", "Projected market size by 2030, growing at 32.4% CAGR as enterprises dump batch ETL."),
        ("$18.8 Billion", "Product Analytics Market", "Demand for real-time behavioural insights over static pageview trackers."),
        ("400,000+", "Target Growth Companies", "High-growth tech businesses actively investing in multi-channel attribution.")
    ]
    
    for i, (num, label, detail) in enumerate(tam_metrics):
        x = Inches(0.8 + i * 4.0)
        card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.5), Inches(3.7), Inches(3.8))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = ACCENT_EMERALD if i == 0 else ACCENT_CYAN
        card.line.width = Pt(1.5)
        
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.3)
        ctf.margin_top = Inches(0.35)
        ctf.margin_right = Inches(0.3)
        
        p1 = ctf.paragraphs[0]
        p1.text = num
        p1.font.bold = True
        p1.font.size = Pt(28)
        p1.font.color.rgb = ACCENT_EMERALD if i == 0 else ACCENT_CYAN
        
        p2 = ctf.add_paragraph()
        p2.text = label
        p2.font.bold = True
        p2.font.size = Pt(16)
        p2.font.color.rgb = TEXT_LIGHT
        p2.space_before = Pt(8)
        
        p3 = ctf.add_paragraph()
        p3.text = detail
        p3.font.size = Pt(13)
        p3.font.color.rgb = TEXT_MUTED
        p3.space_before = Pt(10)

    # ----------------------------------------------------
    # SLIDE 7: BUSINESS MODEL & GO-TO-MARKET
    # ----------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "Business Model", "Product-Led Growth (PLG) & Developer Adoption", "Open-core strategy designed for rapid bottom-up adoption into enterprise contracts.")
    
    tiers = [
        ("Community Edition", "$0 / Free & Open Source", "Self-hosted Next.js dashboard, standard real-time simulation engine, local data persistence, unlimited dashboard views."),
        ("Pro Cloud", "$199 / month", "Managed live ingestion API, multi-channel webhook connectors (Stripe, Segment, Meta Ads), 90-day retention, real-time Slack/Discord alerts."),
        ("Enterprise Cluster", "Custom ARR ($25k+)", "Dedicated stream processors, custom predictive ML models, SSO/SAML, SOC2 compliance, private cloud deployment (AWS, GCP, Azure).")
    ]
    
    for i, (tier, price, perks) in enumerate(tiers):
        x = Inches(0.8 + i * 4.0)
        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.5), Inches(3.7), Inches(4.0))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = ACCENT_CYAN if i == 1 else ACCENT_PURPLE
        card.line.width = Pt(1.5 if i == 1 else 1.0)
        
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.3)
        ctf.margin_top = Inches(0.35)
        ctf.margin_right = Inches(0.3)
        
        p1 = ctf.paragraphs[0]
        p1.text = tier
        p1.font.bold = True
        p1.font.size = Pt(20)
        p1.font.color.rgb = ACCENT_CYAN if i == 1 else TEXT_LIGHT
        
        p2 = ctf.add_paragraph()
        p2.text = price
        p2.font.bold = True
        p2.font.size = Pt(15)
        p2.font.color.rgb = ACCENT_EMERALD
        p2.space_before = Pt(6)
        
        p3 = ctf.add_paragraph()
        p3.text = perks
        p3.font.size = Pt(12)
        p3.font.color.rgb = TEXT_MUTED
        p3.space_before = Pt(10)

    # ----------------------------------------------------
    # SLIDE 8: ROADMAP & FUTURE VISION
    # ----------------------------------------------------
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "Roadmap", "Executing Toward Autonomous Event Intelligence", "From real-time visualization to closed-loop automated marketing orchestration.")
    
    milestones = [
        ("Phase 1: Foundation (Delivered)", "Interactive multi-page dashboard, synthetic streaming engine, predictive demand curves, and attribution heatmaps."),
        ("Phase 2: Ingestion Connectors (Q2 2026)", "Native webhooks for Segment, Snowplow, PostHog, Stripe, and Meta Conversions API."),
        ("Phase 3: AI Copilot & Anomaly Alerts (Q3 2026)", "Agentic natural-language queries ('Why did TikTok conversions drop 18%?') and automated causal diagnosis."),
        ("Phase 4: Closed-Loop Orchestration (Q4 2026)", "Automated budget shifting algorithms that autonomously re-route ad spend toward peak-performing demand channels.")
    ]
    
    for i, (title, desc) in enumerate(milestones):
        y = Inches(2.3 + i * 1.15)
        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.7), Inches(0.95))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = ACCENT_PURPLE if i > 0 else ACCENT_EMERALD
        card.line.width = Pt(1.5 if i == 0 else 1.0)
        
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.3)
        ctf.margin_top = Inches(0.15)
        
        p1 = ctf.paragraphs[0]
        p1.text = title
        p1.font.bold = True
        p1.font.size = Pt(15)
        p1.font.color.rgb = ACCENT_EMERALD if i == 0 else TEXT_LIGHT
        
        p2 = ctf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_MUTED

    # ----------------------------------------------------
    # SLIDE 9: CONCLUSION & DEMO CALL-TO-ACTION
    # ----------------------------------------------------
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    
    tb9 = s9.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(11.3), Inches(4.0))
    tf9 = tb9.text_frame
    tf9.word_wrap = True
    
    p = tf9.paragraphs[0]
    p.text = "Experience the Live Pulse Engine"
    p.font.bold = True
    p.font.size = Pt(44)
    p.font.color.rgb = ACCENT_CYAN
    
    p2 = tf9.add_paragraph()
    p2.text = "The code is fully open-source and ready for production deployment."
    p2.font.size = Pt(20)
    p2.font.color.rgb = TEXT_LIGHT
    p2.space_before = Pt(12)
    
    p3 = tf9.add_paragraph()
    p3.text = "• Live Dashboard: http://localhost:3000\n• GitHub: https://github.com/Meera2926/pulse-dashboard\n• Documentation: See README.md, DEPLOYMENT.md, and PROBLEM_STATEMENT.md"
    p3.font.size = Pt(16)
    p3.font.color.rgb = TEXT_MUTED
    p3.space_before = Pt(24)
    
    prs.save(filename)
    print(f"Successfully generated {filename}")

if __name__ == "__main__":
    create_deck()
