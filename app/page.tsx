"use client";

import { useRouter } from "next/navigation";
import {
  BookOpen,
  Brain,
  FileText,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  Send,
  Star,
} from "lucide-react";
import { useState } from "react";
import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";
import { features } from "@/data/features";
import { benefits } from "@/data/benefits";
import { testimonials } from "@/data/testimonials";
import { faqs } from "@/data/faqs";

export default function LandingPage() {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-50 via-white to-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Content */}
          <div className="text-center py-20">
            <div className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              🎯 AI-Powered Study Organization
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Organize. Summarize.
              <br />
              <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                Study Smarter.
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Transform your study materials with AI-powered organization,
              automatic summaries, and intelligent flashcards. Perfect for
              students who want to study more effectively.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={() => navigateTo("/signup")}
                className="px-10 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center"
              >
                Get Started Free
                <ArrowRight size={22} className="ml-3" />
              </button>
              <button
                onClick={() => navigateTo("/login")}
                className="px-10 py-4 border-2 border-red-300 text-red-600 rounded-full text-lg font-semibold hover:border-red-400 hover:bg-red-50 transition-all"
              >
                Sign In
              </button>
            </div>

            {/* Enhanced Illustration */}
            <div className="bg-gradient-to-br from-red-100 via-white to-red-50 rounded-3xl p-16 mx-auto max-w-5xl border-2 border-red-200 shadow-2xl">
              <div className="flex items-center justify-center space-x-12">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-red-100">
                  <BookOpen size={80} className="text-red-500" />
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl shadow-lg">
                  <Brain size={80} className="text-white" />
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-red-100">
                  <FileText size={80} className="text-red-500" />
                </div>
              </div>
              <p className="text-red-600 mt-6 text-xl font-semibold">
                AI-Powered Study Assistant
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="features" className="py-20 bg-white border-t-4 border-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-red-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-4">
              HOW IT WORKS
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              How StudyMate Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to transform your studying
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all group-hover:scale-110">
                  <feature.icon size={36} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                {index < features.length - 1 && (
                  <ArrowRight
                    size={28}
                    className="text-red-300 mx-auto mt-8 hidden lg:block"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Benefits Section */}
      <div className="py-20 bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-white text-red-600 border-2 border-red-500 px-6 py-2 rounded-full text-sm font-bold mb-4">
              KEY BENEFITS
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600">
              Study more effectively with AI assistance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl border-2 border-red-100 hover:border-red-300 hover:shadow-2xl transition-all group"
              >
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <benefit.icon size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-red-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-4">
              TESTIMONIALS
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of students studying smarter
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-red-50 p-8 rounded-3xl border-2 border-red-100 hover:border-red-300 hover:shadow-2xl transition-all"
              >
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="text-red-500 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed text-lg font-medium">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-red-200"
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      {testimonial.name}
                    </p>
                    <p className="text-red-600 font-medium">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="py-20 bg-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-white text-red-600 border-2 border-red-500 px-6 py-2 rounded-full text-sm font-bold mb-4">
              FAQ
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border-2 border-red-100 overflow-hidden transition-all hover:border-red-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-xl font-bold text-gray-900">
                    {faq.question}
                  </span>
                  {openFaqIndex === index ? (
                    <ChevronUp className="text-red-500" size={24} />
                  ) : (
                    <ChevronDown className="text-gray-400" size={24} />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div className="px-8 pb-8 text-gray-600 text-lg leading-relaxed animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Us Section */}
      <div id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block bg-red-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-4">
                CONTACT US
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                Have a question or feedback? We'd love to hear from you. Fill
                out the form or reach us via email.
              </p>

              <div className="space-y-8">
                <div className="flex items-center space-x-6">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-red-600" size={28} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                      Email Us
                    </p>
                    <p className="text-xl text-gray-900 font-medium">
                      support@studymate.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-red-600" size={28} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                      Call Us
                    </p>
                    <p className="text-xl text-gray-900 font-medium">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-red-600" size={28} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                      Location
                    </p>
                    <p className="text-xl text-gray-900 font-medium">
                      San Francisco, CA
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100 shadow-lg">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button
                  type="button"
                  className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  Send Message
                  <Send size={20} className="ml-2" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
