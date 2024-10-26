import React from "react";
import { ArrowRight, Shield, Laptop, Brain, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
          Your Journey into Web3
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform your Web2 knowledge into Web3 expertise through personalized
          learning paths, interactive tutorials, and hands-on experience.
        </p>
        <Button size="lg" className="gap-2">
          Start Your Journey <ArrowRight className="h-4 w-4" />
        </Button>
      </section>

      {/* Key Concepts Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Essential Web3 Concepts</h2>
          <p className="text-muted-foreground mt-2">
            Master these fundamentals before diving deeper
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Blockchain Basics
              </CardTitle>
              <CardDescription>
                Understanding decentralization, consensus mechanisms, and
                blockchain architecture.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>What is decentralization?</li>
                <li>How do blocks and chains work?</li>
                <li>Understanding consensus</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Laptop className="h-5 w-5 text-green-500" />
                Digital Wallets
              </CardTitle>
              <CardDescription>
                Your gateway to the Web3 ecosystem and digital asset management.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Types of wallets</li>
                <li>Security best practices</li>
                <li>Managing private keys</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Smart Contracts
              </CardTitle>
              <CardDescription>
                Self-executing contracts that power decentralized applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Contract fundamentals</li>
                <li>Common use cases</li>
                <li>Interaction basics</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="space-y-8 bg-muted/50 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Why Choose Our Platform?</h2>
          <p className="text-muted-foreground mt-2">
            Built for developers, by developers
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Star,
              title: "Personalized Path",
              description:
                "Learning adapted to your experience level and goals",
            },
            {
              icon: Shield,
              title: "Practice Safely",
              description:
                "Risk-free environment to experiment with Web3 concepts",
            },
            {
              icon: Brain,
              title: "AI Assistance",
              description: "Get help and answers when you need them",
            },
            {
              icon: Laptop,
              title: "Hands-on Learning",
              description: "Real-world projects and interactive tutorials",
            },
          ].map((feature, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              className="flex flex-col items-center text-center space-y-2"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-lg p-12">
        <h2 className="text-3xl font-bold">
          Ready to Start Your Web3 Journey?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of developers who are already building the future of
          the internet. Start your personalized learning path today.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="gap-2">
            Start Learning <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            View Curriculum
          </Button>
        </div>
      </section>
    </div>
  );
}
