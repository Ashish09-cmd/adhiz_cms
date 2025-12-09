'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { useTheme } from '@/hooks/useTheme';
import { Icon } from '@iconify/react';

export default function ExamplePage() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-text-primary">Dark Mode Example</h1>
          <Button onClick={toggleTheme} variant="secondary">
            <Icon icon={isDark ? 'heroicons:sun-20-solid' : 'heroicons:moon-20-solid'} className="w-5 h-5 mr-2" />
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Color Palette</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-bg-primary border border-border-primary rounded"></div>
                <p className="text-sm">Primary Background</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-bg-secondary border border-border-secondary rounded"></div>
                <p className="text-sm">Secondary Background</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-bg-card border border-border-card rounded"></div>
                <p className="text-sm">Card Background</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-bg-button-primary border border-border-button rounded"></div>
                <p className="text-sm">Button Primary</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Typography</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-text-primary">Primary Text - This is the main text color.</p>
            <p className="text-text-secondary">Secondary Text - This is secondary text.</p>
            <p className="text-text-tertiary">Tertiary Text - This is tertiary text.</p>
            <p className="text-text-disabled">Disabled Text - This is disabled text.</p>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Buttons</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="sm">Primary Small</Button>
              <Button variant="primary" size="md">Primary Medium</Button>
              <Button variant="primary" size="lg">Primary Large</Button>
              <Button variant="secondary" size="sm">Secondary Small</Button>
              <Button variant="secondary" size="md">Secondary Medium</Button>
              <Button variant="secondary" size="lg">Secondary Large</Button>
              <Button disabled>Disabled</Button>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card variant="default">
            <CardHeader>
              <h3 className="text-lg font-semibold">Default Card</h3>
            </CardHeader>
            <CardContent>
              <p>This is a default card with standard styling.</p>
            </CardContent>
            <CardFooter>
              <Button variant="primary" size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <h3 className="text-lg font-semibold">Elevated Card</h3>
            </CardHeader>
            <CardContent>
              <p>This is an elevated card with shadow effects.</p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" size="sm">Action</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Animations Demo */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Animations</h2>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Hover over the buttons and cards above to see scale and opacity animations.</p>
            <div className="flex gap-4">
              <Button className="animate-scale-in">Scale In</Button>
              <Button className="animate-fade-in">Fade In</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
