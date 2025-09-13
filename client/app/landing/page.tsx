"use client";

import { useState } from "react";
import { ArrowRight, BarChart3, Shield, Users, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  type Feature = {
    icon: LucideIcon;
    title: string;
    description: string;
    details: string;
  };

  const features: Feature[] = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Comprehensive risk assessment using multiple data points including attendance, grades, and behavioral indicators.",
      details:
        "Our AI-powered system analyzes patterns across academic performance, attendance records, and engagement metrics to identify students who may need additional support.",
    },
    {
      icon: Shield,
      title: "Early Intervention",
      description:
        "Proactive identification of at-risk students before problems escalate.",
      details:
        "Machine learning algorithms detect early warning signs, enabling educators to intervene with targeted support strategies before academic challenges become critical.",
    },
    {
      icon: Users,
      title: "Collaborative Platform",
      description:
        "Seamless communication between teachers, counselors, and administrators.",
      details:
        "Unified dashboard facilitates collaboration among educational stakeholders, ensuring comprehensive support for every student through coordinated intervention efforts.",
    },
    {
      icon: Zap,
      title: "Real-time Alerts",
      description:
        "Instant notifications when students show signs of academic distress.",
      details:
        "Automated alert system sends immediate notifications to relevant staff members when risk thresholds are exceeded, enabling rapid response to student needs.",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Principal, Lincoln High School",
      content:
        "This platform has transformed how we support our students. Early identification has improved our intervention success rate by 40%.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "School Counselor, Roosevelt Middle",
      content:
        "The collaborative features make it easy to coordinate with teachers and track student progress. It's become essential to our workflow.",
      rating: 5,
    },
    {
      name: "Lisa Rodriguez",
      role: "Math Teacher, Washington Elementary",
      content:
        "I can now identify struggling students weeks earlier than before. The data insights are incredibly valuable for planning interventions.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                EduGuard
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Identify At-Risk Students
              <span className="text-primary block">Before It's Too Late</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
              Advanced early warning system that helps educators proactively
              support students through AI-powered risk assessment and
              collaborative intervention planning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="px-8 bg-transparent"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Comprehensive Student Support System
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to identify, track, and support at-risk
              students in one integrated platform.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all duration-300 ${
                      activeFeature === index
                        ? "border-primary bg-primary/5 shadow-lg"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`p-2 rounded-lg ${
                            activeFeature === index
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="lg:pl-8">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex gap-2">
                      {features.map((_, i) => (
                        <Button
                          key={i}
                          variant={i === activeFeature ? "default" : "outline"}
                          onClick={() => setActiveFeature(i)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {features[activeFeature]?.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {features[activeFeature]?.details}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">40%</div>
              <div className="text-muted-foreground">
                Improvement in early intervention success
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">2.5x</div>
              <div className="text-muted-foreground">
                Faster identification of at-risk students
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">
                User satisfaction rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Trusted by Educators Nationwide
            </h2>
            <p className="text-xl text-muted-foreground">
              See how schools are transforming student support with EduGuard
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-accent text-accent"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Ready to Transform Student Support?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of educators using EduGuard to identify and support
            at-risk students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 bg-transparent">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  EduGuard
                </span>
              </div>
              <p className="text-muted-foreground">
                Empowering educators with AI-driven insights to support every
                student's success.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Demo
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 EduGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
