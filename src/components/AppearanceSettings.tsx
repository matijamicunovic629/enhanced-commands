import React from 'react';
import { Check } from 'lucide-react';
import { useStore, wallpapers, Wallpaper } from '../store/useStore';

interface WallpaperGroupProps {
  title: string;
  type: Wallpaper['type'];
  wallpapers: Wallpaper[];
  currentWallpaper: Wallpaper;
  onSelect: (wallpaper: Wallpaper) => void;
}

const WallpaperGroup: React.FC<WallpaperGroupProps> = ({
  title,
  type,
  wallpapers,
  currentWallpaper,
  onSelect,
}) => {
  const typeWallpapers = wallpapers.filter(w => w.type === type);

  return (
    <div>
      <h3 className="text-sm font-medium text-white/60 mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {typeWallpapers.map((wallpaper) => (
          <button
            key={wallpaper.id}
            onClick={() => onSelect(wallpaper)}
            className="relative group rounded-lg overflow-hidden aspect-video"
          >
            <img
              src={wallpaper.thumbnail}
              alt={wallpaper.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center">
              {currentWallpaper.id === wallpaper.id && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
              <span className="text-sm font-medium text-white/90">
                {wallpaper.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export const AppearanceSettings: React.FC = () => {
  const { currentWallpaper, setWallpaper } = useStore();

  const handleWallpaperChange = (wallpaper: Wallpaper) => {
    // Preload the image before setting it as wallpaper
    const img = new Image();
    img.src = wallpaper.url;
    img.onload = () => {
      setWallpaper(wallpaper);
      document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${wallpaper.url}')`;
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-1">Appearance</h2>
        <p className="text-sm text-white/60">
          Customize the look and feel of your workspace
        </p>
      </div>

      <div className="space-y-6">
        <WallpaperGroup
          title="City Views"
          type="CITY"
          wallpapers={wallpapers}
          currentWallpaper={currentWallpaper}
          onSelect={handleWallpaperChange}
        />

        <WallpaperGroup
          title="Nature"
          type="NATURE"
          wallpapers={wallpapers}
          currentWallpaper={currentWallpaper}
          onSelect={handleWallpaperChange}
        />

        <WallpaperGroup
          title="Abstract"
          type="ABSTRACT"
          wallpapers={wallpapers}
          currentWallpaper={currentWallpaper}
          onSelect={handleWallpaperChange}
        />
      </div>
    </div>
  );
};