
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const MetaAdLibrary = () => {
  const [keyword, setKeyword] = useState('');
  const [searchUrl, setSearchUrl] = useState('');
  const [error, setError] = useState('');

  const handleAnalyze = () => {
    if (!keyword) {
      setError('Por favor, ingresa un término de búsqueda (ej. el nombre de una marca).');
      return;
    }

    setError('');
    const url = `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&q=${encodeURIComponent(keyword)}&search_type=keyword_unordered&media_type=all`;
    setSearchUrl(url);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Introduce un nombre o palabra clave"
            className="flex-grow"
          />
          <Button onClick={handleAnalyze} className="w-full sm:w-auto">
            <Search className="w-4 h-4 mr-2" />
            Buscar Anuncios
          </Button>
        </div>
        
        {error && (
            <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {searchUrl && (
          <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden border">
            <iframe
              src={searchUrl}
              title="Meta Ad Library"
              className="w-full h-full"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetaAdLibrary;
