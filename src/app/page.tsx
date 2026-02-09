"use client";

import { useState } from 'react';
import Sidebar, { type ToolId } from '@/components/Sidebar';
import ProspectQualifier from '@/components/tools/ProspectQualifier';
import SalesTargetCalculator from '@/components/tools/SalesTargetCalculator';
import UnitEconomics from '@/components/tools/UnitEconomics';

export default function Home() {
  const [currentTool, setCurrentTool] = useState<ToolId>('prospect');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      <Sidebar
        currentTool={currentTool}
        onSelectTool={setCurrentTool}
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
      />
      <main className="flex-1 overflow-y-auto">
        {currentTool === 'prospect' && <ProspectQualifier />}
        {currentTool === 'calculator' && <SalesTargetCalculator />}
        {currentTool === 'unit-economics' && <UnitEconomics />}
      </main>
    </div>
  );
}
