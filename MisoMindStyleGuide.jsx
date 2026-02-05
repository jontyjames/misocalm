import React from 'react';
import { Heart, ChevronRight, Star, Lock, Check, X, Bell, Settings, User, Home, Plus, MessageCircle, BookOpen, Wind, Moon, Zap, TrendingUp, Gift, Search, Eye, EyeOff } from 'lucide-react';

const MisoMindStyleGuide = () => {
  // Color definitions
  const colors = {
    primary: [
      { name: 'Void Black', hex: '#030712', rgb: '3, 7, 18', usage: 'Main background, deepest layer' },
      { name: 'Deep Space', hex: '#0f172a', rgb: '15, 23, 42', usage: 'Secondary backgrounds, cards' },
      { name: 'Slate 900', hex: '#0f172a', rgb: '15, 23, 42', usage: 'Card backgrounds, elevated surfaces' },
      { name: 'Slate 800', hex: '#1e293b', rgb: '30, 41, 59', usage: 'Borders, dividers, inactive states' },
    ],
    accent: [
      { name: 'Indigo 400', hex: '#818cf8', rgb: '129, 140, 248', usage: 'Primary accent, active states, links' },
      { name: 'Cyan 400', hex: '#22d3ee', rgb: '34, 211, 238', usage: 'Success states, progress, highlights' },
      { name: 'Purple 400', hex: '#a78bfa', rgb: '167, 139, 250', usage: 'Premium features, special content' },
      { name: 'Pink 400', hex: '#f472b6', rgb: '244, 114, 182', usage: 'Emotional, heart-related features' },
    ],
    semantic: [
      { name: 'Emerald 400', hex: '#34d399', rgb: '52, 211, 153', usage: 'Success, completion, positive' },
      { name: 'Amber 400', hex: '#fbbf24', rgb: '251, 191, 36', usage: 'Warnings, favorites, stars' },
      { name: 'Rose 400', hex: '#fb7185', rgb: '251, 113, 133', usage: 'Errors, destructive actions' },
    ],
    text: [
      { name: 'White', hex: '#ffffff', rgb: '255, 255, 255', usage: 'Primary text, headings' },
      { name: 'Slate 300', hex: '#cbd5e1', rgb: '203, 213, 225', usage: 'Secondary text, descriptions' },
      { name: 'Slate 400', hex: '#94a3b8', rgb: '148, 163, 184', usage: 'Tertiary text, labels' },
      { name: 'Slate 500', hex: '#64748b', rgb: '100, 116, 139', usage: 'Muted text, placeholders' },
      { name: 'Slate 600', hex: '#475569', rgb: '71, 85, 105', usage: 'Disabled text, hints' },
    ]
  };

  const gradients = [
    {
      name: 'Primary CTA',
      css: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 100%)',
      tailwind: 'bg-gradient-to-br from-indigo-500/20 to-purple-500/10',
      usage: 'Primary buttons, main CTAs'
    },
    {
      name: 'Nebula Indigo',
      css: 'radial-gradient(ellipse, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.1) 40%, transparent 70%)',
      tailwind: 'Custom CSS required',
      usage: 'Background glow effects (top-right)'
    },
    {
      name: 'Nebula Cyan',
      css: 'radial-gradient(ellipse, rgba(34,211,238,0.25) 0%, rgba(6,182,212,0.1) 40%, transparent 70%)',
      tailwind: 'Custom CSS required',
      usage: 'Background glow effects (bottom-left)'
    },
    {
      name: 'Card Highlight',
      css: 'linear-gradient(160deg, rgba(99,102,241,0.1) 0%, rgba(15,23,42,0.8) 100%)',
      tailwind: 'Custom CSS required',
      usage: 'Featured cards, stat cards'
    },
    {
      name: 'Progress Bar',
      css: 'linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #22d3ee 100%)',
      tailwind: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400',
      usage: 'Progress indicators, streaks'
    },
    {
      name: 'Logo Ring',
      css: 'linear-gradient(135deg, #818cf8 0%, #a855f7 50%, #22d3ee 100%)',
      tailwind: 'bg-gradient-to-br from-indigo-400 via-purple-500 to-cyan-400',
      usage: 'Animated logo, brand element'
    },
    {
      name: 'Text Gradient',
      css: 'linear-gradient(90deg, #67e8f9 0%, #a5b4fc 50%, #c4b5fd 100%)',
      tailwind: 'bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent',
      usage: 'Highlighted names, special text'
    }
  ];

  const typography = {
    fontFamily: {
      primary: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: 'ui-monospace, "SF Mono", Monaco, monospace'
    },
    scale: [
      { name: 'Display', size: '36px', weight: '100', lineHeight: '1.1', tailwind: 'text-4xl font-thin', usage: 'Welcome screens, hero text' },
      { name: 'H1', size: '30px', weight: '100', lineHeight: '1.2', tailwind: 'text-3xl font-thin', usage: 'Page titles' },
      { name: 'H2', size: '24px', weight: '100', lineHeight: '1.3', tailwind: 'text-2xl font-thin', usage: 'Section headers' },
      { name: 'H3', size: '20px', weight: '300', lineHeight: '1.4', tailwind: 'text-xl font-light', usage: 'Card titles' },
      { name: 'Body', size: '14px', weight: '300', lineHeight: '1.6', tailwind: 'text-sm font-light', usage: 'Main content' },
      { name: 'Body Small', size: '12px', weight: '300', lineHeight: '1.5', tailwind: 'text-xs font-light', usage: 'Secondary content' },
      { name: 'Caption', size: '10px', weight: '300', lineHeight: '1.4', tailwind: 'text-[10px] font-light', usage: 'Labels, metadata' },
      { name: 'Overline', size: '10px', weight: '300', lineHeight: '1.4', tailwind: 'text-[10px] uppercase tracking-[0.15em]', usage: 'Section labels, categories' },
    ]
  };

  const spacing = [
    { name: 'xs', value: '4px', tailwind: '1', usage: 'Tight gaps, icon spacing' },
    { name: 'sm', value: '8px', tailwind: '2', usage: 'Compact elements, badges' },
    { name: 'md', value: '12px', tailwind: '3', usage: 'Card gaps, button padding' },
    { name: 'lg', value: '16px', tailwind: '4', usage: 'Section spacing, card padding' },
    { name: 'xl', value: '20px', tailwind: '5', usage: 'Page padding, major gaps' },
    { name: '2xl', value: '24px', tailwind: '6', usage: 'Section separators' },
    { name: '3xl', value: '32px', tailwind: '8', usage: 'Major section breaks' },
  ];

  const radii = [
    { name: 'sm', value: '4px', tailwind: 'rounded', usage: 'Small badges, tags' },
    { name: 'md', value: '8px', tailwind: 'rounded-lg', usage: 'Buttons, inputs' },
    { name: 'lg', value: '12px', tailwind: 'rounded-xl', usage: 'Cards, modals' },
    { name: 'xl', value: '16px', tailwind: 'rounded-2xl', usage: 'Large cards, containers' },
    { name: '2xl', value: '24px', tailwind: 'rounded-3xl', usage: 'Feature cards, hero elements' },
    { name: 'full', value: '9999px', tailwind: 'rounded-full', usage: 'Avatars, pills, circular buttons' },
  ];

  const shadows = [
    { name: 'Glow Indigo', value: '0 0 60px rgba(99,102,241,0.3)', tailwind: 'shadow-[0_0_60px_rgba(99,102,241,0.3)]', usage: 'Hover states, focus rings' },
    { name: 'Glow Cyan', value: '0 0 60px rgba(34,211,238,0.3)', tailwind: 'shadow-[0_0_60px_rgba(34,211,238,0.3)]', usage: 'Success states, active elements' },
    { name: 'Glow Purple', value: '0 0 40px rgba(139,92,246,0.3)', tailwind: 'shadow-[0_0_40px_rgba(139,92,246,0.3)]', usage: 'Premium features' },
    { name: 'Subtle', value: '0 4px 20px rgba(0,0,0,0.3)', tailwind: 'shadow-lg shadow-black/30', usage: 'Elevated cards' },
    { name: 'Inner Glow', value: 'inset 0 1px 0 rgba(255,255,255,0.05)', tailwind: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]', usage: 'Glass effect enhancement' },
  ];

  // Starfield component for backgrounds
  const Starfield = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.4 + 0.1,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 2 + 2}s`
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen text-white" style={{background: 'linear-gradient(180deg, #030712 0%, #0f172a 50%, #020617 100%)'}}>
      <Starfield />
      
      {/* Header */}
      <div className="relative border-b border-slate-800/50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-cyan-400 animate-spin" style={{animationDuration: '8s'}} />
              <div className="absolute inset-1 rounded-full bg-slate-950 flex items-center justify-center">
                <Heart className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-thin">MisoMind</h1>
              <p className="text-slate-500 text-sm font-light">Design System & Style Guide</p>
            </div>
          </div>
          <p className="text-slate-400 font-light max-w-2xl">
            Cosmic Serenity theme — A calming, ethereal dark mode design system for the MisoMind wellness application.
          </p>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto p-8 space-y-16">
        
        {/* Design Mood */}
        <section>
          <h2 className="text-2xl font-thin mb-6 flex items-center gap-3">
            <span className="text-2xl">💭</span>
            Design Mood
          </h2>
          <div className="flex flex-wrap gap-3">
            {['Transcendent', 'Meditative', 'Infinite Calm', 'Premium'].map(mood => (
              <span key={mood} className="px-6 py-3 rounded-full border border-indigo-500/30 text-indigo-300 font-light text-lg" style={{background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.05) 100%)'}}>
                {mood}
              </span>
            ))}
          </div>
          <p className="mt-4 text-slate-500 font-light">
            The design evokes a sense of floating in deep space — peaceful, expansive, and safe. Cool tones promote calm while subtle animations create a living, breathing interface.
          </p>
        </section>

        {/* Core Colors */}
        <section>
          <h2 className="text-2xl font-thin mb-6 flex items-center gap-3">
            <span className="text-2xl">🎨</span>
            Core Colors
          </h2>
          
          <div className="space-y-8">
            {/* Primary/Background Colors */}
            <div>
              <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-4">Background Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {colors.primary.map(color => (
                  <div key={color.hex} className="rounded-xl overflow-hidden border border-slate-800">
                    <div className="h-20" style={{backgroundColor: color.hex}} />
                    <div className="p-3 bg-slate-900/50">
                      <p className="font-light text-white text-sm">{color.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{color.hex}</p>
                      <p className="text-[10px] text-slate-600 mt-1">{color.usage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accent Colors */}
            <div>
              <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-4">Accent Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {colors.accent.map(color => (
                  <div key={color.hex} className="rounded-xl overflow-hidden border border-slate-800">
                    <div className="h-20" style={{backgroundColor: color.hex}} />
                    <div className="p-3 bg-slate-900/50">
                      <p className="font-light text-white text-sm">{color.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{color.hex}</p>
                      <p className="text-[10px] text-slate-600 mt-1">{color.usage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Semantic Colors */}
            <div>
              <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-4">Semantic Colors</h3>
              <div className="grid grid-cols-3 gap-4">
                {colors.semantic.map(color => (
                  <div key={color.hex} className="rounded-xl overflow-hidden border border-slate-800">
                    <div className="h-16" style={{backgroundColor: color.hex}} />
                    <div className="p-3 bg-slate-900/50">
                      <p className="font-light text-white text-sm">{color.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{color.hex}</p>
                      <p className="text-[10px] text-slate-600 mt-1">{color.usage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Text Colors */}
            <div>
              <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-4">Text Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {colors.text.map(color => (
                  <div key={color.hex} className="rounded-xl p-4 border border-slate-800 bg-slate-900/30">
                    <p className="text-lg font-light mb-2" style={{color: color.hex}}>Aa</p>
                    <p className="font-light text-white text-xs">{color.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{color.hex}</p>
                    <p className="text-[10px] text-slate-600 mt-1">{color.usage}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Gradients */}
        <section>
          <h2 className="text-2xl font-thin mb-6 flex items-center gap-3">
            <span className="text-2xl">🌈</span>
            Gradients
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {gradients.map(gradient => (
              <div key={gradient.name} className="rounded-xl border border-slate-800 overflow-hidden">
                <div className="h-24 relative" style={{background: gradient.css}}>
                  {gradient.name.includes('Nebula') && (
                    <div className="absolute inset-0" style={{background: 'linear-gradient(180deg, #030712 0%, transparent 100%)'}} />
                  )}
                </div>
                <div className="p-4 bg-slate-900/50">
                  <p className="font-light text-white">{gradient.name}</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono break-all">{gradient.css}</p>
                  <p className="text-[10px] text-cyan-400/70 mt-2">Tailwind: {gradient.tailwind}</p>
                  <p className="text-[10px] text-slate-600 mt-1">{gradient.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-2xl font-thin mb-6 flex items-center gap-3">
            <span className="text-2xl">✏️</span>
            Typography
          </h2>
          
          <div className="rounded-xl border border-slate-800 p-6 mb-6 bg-slate-900/30">
            <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-4">Font Family</h3>
            <p className="font-light text-slate-300 mb-2">Primary: <span className="text-white font-mono text-sm">{typography.fontFamily.primary}</span></p>
            <p className="font-light text-slate-300">Monospace: <span className="text-white font-mono text-sm">{typography.fontFamily.mono}</span></p>
          </div>

          <div className="space-y-4">
            {typography.scale.map(type => (
              <div key={type.name} className="rounded-xl border border-slate-800 p-4 bg-slate-900/30 flex flex-col md:flex-row md:items-center gap-4">
                <div className="md:w-48 flex-shrink-0">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{type.name}</p>
                  <p className="text-[10px] text-slate-600">{type.size} / {type.weight} / {type.lineHeight}</p>
                </div>
                <div className="flex-1">
                  <p style={{fontSize: type.size, fontWeight: type.weight, lineHeight: type.lineHeight}} className="text-white">
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
                <div className="md:w-64 flex-shrink-0">
                  <p className="text-[10px] text-cyan-400/70 font-mono">{type.tailwind}</p>
                  <p className="text-[10px] text-slate-600">{type.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Components */}
        <section>
          <h2 className="text-2xl font-thin mb-6 flex items-center gap-3">
            <span className="text-2xl">🧱</span>
            Components
          </h2>

          {/* Buttons */}
          <div className="mb-8">
            <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-4">Buttons</h3>
            <div className="flex flex-wrap gap-4 items-center">
              {/* Primary Button */}
              <button className="px-6 py-3 rounded-xl border border-indigo-500/30 text-white font-light hover:border-indigo-400/50 transition-all" style={{background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 100%)'}}>
                Primary Button
              </button>
              
              {/* Secondary Button */}
              <button className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 font-light hover:border-slate-600 hover:text-white transition-all bg-slate-900/50">
                Secondary
              </button>
              
              {/* Ghost Button */}
              <button className="px-6 py-3 rounded-xl border border-transparent text-slate-400 font-light hover:text-white hover:bg-slate-800/50 transition-all">
                Ghost
              </button>
              
              {/* Icon Button */}
              <button className="w-12 h-12 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:border-indigo-500/30 hover:text-white transition-all bg-slate-900/50">
                <Plus className="w-5 h-5" />
              </button>
              
              {/* Circular Button */}
              <button className="w-12 h-12 rounded-full border border-indigo-500/30 flex items-center justify-center text-indigo-300 hover:bg-indigo-500/10 transition-all" style={{background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 100%)'}}>
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* Disabled Button */}
              <button className="px-6 py-3 rounded-xl border border-slate-800 text-slate-600 font-light cursor-not-allowed bg-slate-900/30" disabled>
                Disabled
              </button>
            </div>
            
            <div className="mt-4 p-4 rounded-lg bg-slate-900/50 border border-slate-800">
              <p className="text-[10px] text-slate-500 font-mono">
                Primary: className="px-6 py-3 rounded-xl border border-indigo-500/30 text-white font-light" style="background: linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 100%)"
              </p>
            </div>
          </div>

          {/* Avatars */}
          <div className="mb-8">
            <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-4">Avatars & Icons</h3>
            <div className="flex flex-wrap gap-4 items-center">
              {/* Animated Logo */}
              <div className="w-14 h-14 rounded-full relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-cyan-400 animate-spin" style={{animationDuration: '8s'}} />
                <div className="absolute inset-1 rounded-full bg-slate-950 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-cyan-300" />
                </div>
              </div>
              
              {/* Static Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              
              {/* Icon in Circle */}
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Wind className="w-5 h-5 text-indigo-400" />
              </div>
              
              {/* Small Icon */}
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="mb-8">
            <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-4">Badges & Tags</h3>
            <div className="flex flex-wrap gap-3 items-center">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs border border-indigo-500/30">Breathwork</span>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs border border-cyan-500/30">Somatic</span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs border border-purple-500/30">Advanced</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs border border-emerald-500/30">Essential</span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs border border-amber-500/30">Level Up</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/30 text-purple-300 text-[9px] font-mono">MODULE2</span>
            </div>
          </div>

          {/* Inputs */}
          <div className="mb-8">
            <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-4">Form Inputs</h3>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
              {/* Text Input */}
              <div>
                <label className="block text-slate-400 text-sm mb-2 font-light">Text Input</label>
                <input
                  type="text"
                  placeholder="Enter your name..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/50 text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm"
                />
              </div>
              
              {/* Search Input */}
              <div>
                <label className="block text-slate-400 text-sm mb-2 font-light">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900/50 text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none transition-all text-sm"
                  />
                </div>
              </div>
              
              {/* Select */}
              <div>
                <label className="block text-slate-400 text-sm mb-2 font-light">Select</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/50 text-white focus:border-indigo-500/50 focus:outline-none transition-all text-sm appearance-none">
                  <option>Select an option...</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </div>
              
              {/* Password Input */}
              <div>
                <label className="block text-slate-400 text-sm mb-2 font-light">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/50 text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none transition-all text-sm"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Checkbox & Radio */}
            <div className="flex gap-8 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-indigo-500/30" />
                <span className="text-sm text-slate-300 font-light">Checkbox option</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="radio" className="w-4 h-4 bg-slate-800 border-slate-700 text-indigo-500 focus:ring-indigo-500/30" />
                <span className="text-sm text-slate-300 font-light">Radio option</span>
              </label>
            </div>
          </div>

          {/* Cards */}
          <div className="mb-8">
            <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-4">Cards</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Basic Card */}
              <div className="rounded-xl p-5 border border-slate-800 bg-slate-900/50">
                <h4 className="font-light text-white mb-2">Basic Card</h4>
                <p className="text-sm text-slate-500 font-light">Standard card with border and subtle background.</p>
              </div>
              
              {/* Highlighted Card */}
              <div className="rounded-xl p-5 border border-indigo-500/20 relative overflow-hidden" style={{background: 'linear-gradient(160deg, rgba(99,102,241,0.1) 0%, rgba(15,23,42,0.8) 100%)'}}>
                <div className="absolute top-0 right-0 w-20 h-20 opacity-40" style={{background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)'}} />
                <h4 className="font-light text-white mb-2 relative">Highlighted Card</h4>
                <p className="text-sm text-slate-400 font-light relative">Featured content with glow effect.</p>
              </div>
              
              {/* Interactive Card */}
              <div className="rounded-xl p-5 border border-slate-800 bg-slate-900/50 hover:border-indigo-500/30 transition-all cursor-pointer group">
                <h4 className="font-light text-white mb-2 group-hover:text-indigo-300 transition-colors">Interactive Card</h4>
                <p className="text-sm text-slate-500 font-light">Hover to see border highlight.</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-4">Navigation Bar</h3>
            <div className="rounded-xl border border-slate-800 overflow-hidden max-w-md mx-auto" style={{background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(3,7,18,1) 100%)'}}>
              <div className="flex justify-around py-3">
                {[
                  { icon: Home, label: 'Home', active: true },
                  { icon: BookOpen, label: 'Tools', active: false },
                  { icon: Plus, label: 'Log', active: false },
                  { icon: MessageCircle, label: 'AI', active: false },
                  { icon: User, label: 'Profile', active: false }
                ].map((item) => (
                  <button
                    key={item.label}
                    className={`flex flex-col items-center gap-1 px-4 py-2 transition-all ${
                      item.active ? 'text-cyan-400' : 'text-slate-600 hover:text-slate-400'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-[10px] font-light">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Spacing & Radius */}
        <section>
          <h2 className="text-2xl font-thin mb-6 flex items-center gap-3">
            <span className="text-2xl">📐</span>
            Spacing & Radius
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Spacing */}
            <div>
              <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-4">Spacing Scale</h3>
              <div className="space-y-3">
                {spacing.map(space => (
                  <div key={space.name} className="flex items-center gap-4">
                    <div className="w-16 text-xs text-slate-500">{space.name}</div>
                    <div className="h-4 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded" style={{width: space.value}} />
                    <div className="text-xs text-slate-400 font-mono">{space.value}</div>
                    <div className="text-xs text-cyan-400/70">p-{space.tailwind}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Border Radius */}
            <div>
              <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-4">Border Radius</h3>
              <div className="flex flex-wrap gap-4">
                {radii.map(radius => (
                  <div key={radius.name} className="text-center">
                    <div 
                      className="w-16 h-16 bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 border border-indigo-500/30 mb-2"
                      style={{borderRadius: radius.value}}
                    />
                    <p className="text-xs text-slate-400">{radius.name}</p>
                    <p className="text-[10px] text-slate-600 font-mono">{radius.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Shadows */}
        <section>
          <h2 className="text-2xl font-thin mb-6 flex items-center gap-3">
            <span className="text-2xl">💫</span>
            Shadows & Glows
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {shadows.map(shadow => (
              <div key={shadow.name} className="text-center">
                <div 
                  className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-slate-900 border border-slate-800"
                  style={{boxShadow: shadow.value}}
                />
                <p className="text-sm text-white font-light">{shadow.name}</p>
                <p className="text-[10px] text-slate-600 mt-1">{shadow.usage}</p>
                <p className="text-[9px] text-cyan-400/70 font-mono mt-2 break-all">{shadow.tailwind}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tailwind Reference */}
        <section>
          <h2 className="text-2xl font-thin mb-6 flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            Tailwind Quick Reference
          </h2>
          
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-900/50 border-b border-slate-800">
              <p className="text-sm text-slate-400 font-light">Copy-paste ready utility classes</p>
            </div>
            <div className="p-4 space-y-4 font-mono text-sm bg-slate-950/50">
              <div>
                <p className="text-slate-500 text-xs mb-1">// Background</p>
                <p className="text-cyan-300">bg-[#030712] {/* Void Black */}</p>
                <p className="text-cyan-300">bg-slate-900/50 {/* Card bg */}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">// Primary Button</p>
                <p className="text-cyan-300">px-6 py-3 rounded-xl border border-indigo-500/30 text-white font-light</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">// Card</p>
                <p className="text-cyan-300">rounded-xl p-5 border border-slate-800 bg-slate-900/50</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">// Input</p>
                <p className="text-cyan-300">px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/50 text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">// Badge</p>
                <p className="text-cyan-300">px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs border border-indigo-500/30</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">// Text Gradient</p>
                <p className="text-cyan-300">bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">// Progress Bar</p>
                <p className="text-cyan-300">h-0.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">// Nav Item Active</p>
                <p className="text-cyan-300">text-cyan-400</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">// Nav Item Inactive</p>
                <p className="text-cyan-300">text-slate-600 hover:text-slate-400</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-slate-800/50 text-center">
          <p className="text-slate-600 font-light text-sm">
            MisoMind Design System v1.0 — Cosmic Serenity Theme
          </p>
          <p className="text-slate-700 text-xs mt-2">
            Created with 💜 for the MisoMind wellness app
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MisoMindStyleGuide;
