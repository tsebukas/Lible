const ColorPalette = () => {
  const colors = [
    {
      name: 'Primary',
      hex: '#2b4c82',
      usage: 'Põhivärv: logo, pealkirjad, nupud',
      tailwind: 'text-primary bg-primary'
    },
    {
      name: 'Secondary',
      hex: '#4a78b3',
      usage: 'Sekundaarne värv: lingid, ikoonid',
      tailwind: 'text-secondary bg-secondary'
    },
    {
      name: 'Background Light',
      hex: '#f8fafc',
      usage: 'Taustavärv (hele)',
      tailwind: 'bg-background'
    },
    {
      name: 'Background Dark',
      hex: '#f1f5f9',
      usage: 'Taustavärv (tumedad paneelid)',
      tailwind: 'bg-background-dark'
    },
    {
      name: 'Text Primary',
      hex: '#1e293b',
      usage: 'Põhitekst',
      tailwind: 'text-content'
    },
    {
      name: 'Text Secondary',
      hex: '#64748b',
      usage: 'Sekundaarne tekst',
      tailwind: 'text-content-light'
    },
    {
      name: 'Accent Success',
      hex: '#16a34a',
      usage: 'Edukad tegevused',
      tailwind: 'text-success bg-success'
    },
    {
      name: 'Accent Warning',
      hex: '#ea580c',
      usage: 'Hoiatused',
      tailwind: 'text-warning bg-warning'
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Lible värviteema</h2>
      <div className="grid gap-4">
        {colors.map(color => (
          <div key={color.name} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
            <div 
              className="w-16 h-16 rounded" 
              style={{ backgroundColor: color.hex }}
            />
            <div>
              <h3 className="font-medium">{color.name}</h3>
              <p className="text-sm text-gray-600">{color.hex}</p>
              <p className="text-sm text-gray-600">{color.usage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;