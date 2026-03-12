/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Cloud, Server, Shield, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full space-y-16"
      >
        <div className="text-center space-y-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block p-5 bg-indigo-500/10 rounded-full mb-2"
          >
            <Cloud className="w-20 h-20 text-indigo-400" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Affordable EKS Cloud
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Your infrastructure is ready. Running on highly optimized, cost-effective AWS Spot Instances.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Server className="w-8 h-8 text-emerald-400" />}
            title="Spot Instances"
            description="Utilizing unused EC2 capacity for up to 90% discount compared to On-Demand prices."
          />
          <FeatureCard 
            icon={<Shield className="w-8 h-8 text-blue-400" />}
            title="Secure VPC"
            description="Isolated network environment with private subnets and a single NAT Gateway."
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-amber-400" />}
            title="High Availability"
            description="Multi-AZ deployment ensuring your application stays online even during interruptions."
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-xl">
          <h2 className="text-2xl font-semibold mb-6">Deployment Status</h2>
          <div className="flex items-center justify-center space-x-3 text-emerald-400 bg-emerald-400/10 py-3 px-6 rounded-full inline-flex">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-lg">All systems operational</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl flex flex-col items-center text-center space-y-4 shadow-lg"
    >
      <div className="p-4 bg-slate-800 rounded-2xl">
        {icon}
      </div>
      <h3 className="text-xl font-medium text-slate-200">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
