import type {
    HardwareItem,
    StatData,
    TeamMember,
    WaterReading,
  } from "../types/project";
  
  export const waterReadings: WaterReading[] = [
    { time: "08:00", value: 12.4 },
    { time: "09:00", value: 18.2 },
    { time: "10:00", value: 15.7 },
    { time: "11:00", value: 24.3 },
    { time: "12:00", value: 21.8 },
    { time: "13:00", value: 29.5 },
    { time: "14:00", value: 26.7 },
    { time: "15:00", value: 32.1 },
  ];
  
  export const stats: StatData[] = [
    {
      label: "Consumo hoje",
      value: "32,1 L",
      description: "Volume registrado nas últimas 24 horas",
      icon: "water",
    },
    {
      label: "Vazão atual",
      value: "2,4 L/min",
      description: "Fluxo de água detectado pelo sensor",
      icon: "flow",
    },
    {
      label: "Leituras",
      value: "1.284",
      description: "Dados registrados pelo sistema",
      icon: "database",
    },
    {
      label: "Status",
      value: "Online",
      description: "Sensor conectado ao sistema",
      icon: "online",
    },
  ];
  
  export const hardwareItems: HardwareItem[] = [
    {
      title: "Arduino",
      description:
        "Responsável por receber os dados do sensor, processá-los e enviá-los para o sistema.",
      image:
        "https://images.unsplash.com/photo-1608564697071-ddf911d81370?auto=format&fit=crop&w=900&q=80",
      tag: "Controlador",
    },
    {
      title: "Sensor de fluxo",
      description:
        "Mede a passagem da água e transforma o fluxo em informações que podem ser processadas.",
      image:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80",
      tag: "Sensor",
    },
    {
      title: "Sistema de dados",
      description:
        "O backend recebe, organiza e armazena as informações para que possam ser visualizadas.",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
      tag: "Backend",
    },
  ];
  
  export const team: TeamMember[] = [
    {
      name: "Nome do integrante",
      role: "Desenvolvimento",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Nome do integrante",
      role: "Hardware / Arduino",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Nome do integrante",
      role: "Design / Interface",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
  ];