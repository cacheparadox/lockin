"use client";

import { useState } from "react";
import { createContract } from "../actions";

export default function ContractForm({ groups, membersByGroup }: { groups: any[], membersByGroup: any }) {
  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.id || "");
  const members = membersByGroup[selectedGroup] || [];

  return (
    <form action={createContract} className="space-y-8 bg-card border-8 border-primary p-10 shadow-brutalist">
      {groups.length === 0 ? (
        <div className="bg-destructive/20 border-4 border-destructive p-4 text-destructive font-black uppercase text-center">
          YOU MUST JOIN A GROUP BEFORE YOU CAN ASSIGN CONTRACTS.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xl font-black uppercase mb-3" htmlFor="group_id">Target Alliance</label>
              <select 
                name="group_id" 
                id="group_id" 
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full border-4 border-primary bg-input p-4 font-bold text-foreground focus:outline-none uppercase shadow-brutalist"
              >
                {groups.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-xl font-black uppercase mb-3" htmlFor="assignee_id">Assign To</label>
              <select 
                name="assignee_id" 
                id="assignee_id" 
                className="w-full border-4 border-primary bg-input p-4 font-bold text-foreground focus:outline-none uppercase shadow-brutalist"
              >
                {members.map((m: any) => <option key={m.id} value={m.id}>{m.username}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xl font-black uppercase mb-3" htmlFor="title">Contract Directive</label>
            <input 
              type="text" 
              name="title" 
              id="title"
              required 
              placeholder="e.g. Conquer 75 Hard" 
              className="w-full border-4 border-primary bg-input p-4 font-bold text-foreground focus:outline-none focus:bg-accent transition-colors uppercase shadow-brutalist" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xl font-black uppercase mb-3" htmlFor="category">Protocol Category</label>
              <select 
                name="category" 
                id="category" 
                className="w-full border-4 border-primary bg-input p-4 font-bold text-foreground focus:outline-none uppercase shadow-brutalist"
              >
                <option value="FITNESS">FITNESS</option>
                <option value="DEEP_WORK">DEEP WORK</option>
                <option value="BUSINESS">BUSINESS</option>
                <option value="STUDY">STUDY</option>
                <option value="CREATIVE">CREATIVE</option>
                <option value="HEALTH">HEALTH</option>
                <option value="FINANCE">FINANCE</option>
                <option value="MINDFULNESS">MINDFULNESS</option>
              </select>
            </div>

            <div>
              <label className="block text-xl font-black uppercase mb-3" htmlFor="difficulty">Difficulty Rating</label>
              <select 
                name="difficulty" 
                id="difficulty" 
                className="w-full border-4 border-primary bg-input p-4 font-bold text-foreground focus:outline-none uppercase shadow-brutalist"
              >
                <option value="EASY">EASY (100 Base XP)</option>
                <option value="MEDIUM">MEDIUM (300 Base XP)</option>
                <option value="HARD">HARD (600 Base XP)</option>
                <option value="EXTREME">EXTREME (1000 Base XP)</option>
                <option value="LEGENDARY">LEGENDARY (2000 Base XP)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xl font-black uppercase mb-3" htmlFor="target_value">Target Value</label>
              <input 
                type="number" 
                name="target_value" 
                id="target_value"
                required 
                placeholder="e.g. 75" 
                className="w-full border-4 border-primary bg-input p-4 font-bold text-foreground focus:outline-none focus:bg-accent transition-colors uppercase shadow-brutalist" 
              />
            </div>
            <div>
              <label className="block text-xl font-black uppercase mb-3" htmlFor="target_metric">Target Metric</label>
              <input 
                type="text" 
                name="target_metric" 
                id="target_metric"
                required 
                placeholder="e.g. Days" 
                className="w-full border-4 border-primary bg-input p-4 font-bold text-foreground focus:outline-none focus:bg-accent transition-colors uppercase shadow-brutalist" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xl font-black uppercase mb-3" htmlFor="deadline">Deadline (Optional)</label>
              <input 
                type="date" 
                name="deadline" 
                id="deadline"
                className="w-full border-4 border-primary bg-input p-4 font-bold text-foreground focus:outline-none focus:bg-accent transition-colors uppercase shadow-brutalist" 
              />
            </div>
            <div>
              <label className="block text-xl font-black uppercase mb-3 text-destructive" htmlFor="optional_stake">Blood Stake</label>
              <input 
                type="text" 
                name="optional_stake" 
                id="optional_stake"
                placeholder="e.g. $100 to Charity" 
                className="w-full border-4 border-destructive bg-input p-4 font-bold text-foreground focus:outline-none focus:bg-destructive/10 transition-colors uppercase shadow-brutalist" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xl font-black uppercase mb-3" htmlFor="description">Mission Details</label>
            <textarea 
              name="description" 
              id="description"
              rows={3} 
              placeholder="Specific requirements..." 
              className="w-full border-4 border-primary bg-input p-4 font-bold text-foreground focus:outline-none focus:bg-accent transition-colors resize-none uppercase shadow-brutalist"
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground px-12 py-6 font-black text-2xl uppercase hover:bg-accent transition-colors shadow-brutalist"
          >
            Enforce Contract
          </button>
        </>
      )}
    </form>
  );
}
