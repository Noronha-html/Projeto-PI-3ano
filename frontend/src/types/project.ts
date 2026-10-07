export interface WaterReading {
    time: string;
    value: number;
  }
  
  export interface StatData {
    label: string;
    value: string;
    description: string;
    icon: string;
  }
  
  export interface TeamMember {
    name: string;
    role: string;
    image: string;
  }
  
  export interface HardwareItem {
    title: string;
    description: string;
    image: string;
    tag: string;
  }