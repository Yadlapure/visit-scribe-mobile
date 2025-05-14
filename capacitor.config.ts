
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.122b8f9728c74bb88392c36265ca844a',
  appName: 'Healthcare Visits',
  webDir: 'dist',
  server: {
    url: 'https://122b8f97-28c7-4bb8-8392-c36265ca844a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera']
    },
    Geolocation: {
      permissions: ['location']
    }
  }
};

export default config;
