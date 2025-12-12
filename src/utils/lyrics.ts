export interface LyricLine {
    time: number;
    text: string;
}

export const fetchLyrics = async (artist: string, title: string, duration: number): Promise<string | null> => {
    try {
        const query = new URLSearchParams({
            artist_name: artist,
            track_name: title,
            duration: duration.toString()
        });

        const response = await fetch(`https://lrclib.net/api/get?${query}`);
        if (!response.ok) {
            // Try search if direct get fails
            const searchResponse = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(artist + ' ' + title)}`);
            if (searchResponse.ok) {
                const searchData = await searchResponse.json();
                if (searchData && searchData.length > 0) {
                    // Find best match based on duration
                    const bestMatch = searchData.find((item: any) => Math.abs(item.duration - duration) < 5);
                    return bestMatch ? bestMatch.syncedLyrics || bestMatch.plainLyrics : null;
                }
            }
            return null;
        }

        const data = await response.json();
        return data.syncedLyrics || data.plainLyrics;
    } catch (error) {
        console.error("Failed to fetch lyrics:", error);
        return null;
    }
};

export const parseLRC = (lrcString: string): LyricLine[] => {
    const lines = lrcString.split('\n');
    const lyrics: LyricLine[] = [];
    const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

    for (const line of lines) {
        const match = timeRegex.exec(line);
        if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            const milliseconds = parseInt(match[3], 10);
            const time = minutes * 60 + seconds + milliseconds / 100;
            const text = line.replace(timeRegex, '').trim();
            if (text) {
                lyrics.push({ time, text });
            }
        }
    }

    return lyrics;
};
