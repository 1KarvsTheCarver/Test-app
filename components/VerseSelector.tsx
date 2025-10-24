import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { AnchorVerse, FaithPath } from '../types';

interface VerseSelectorProps {
  faithPath: FaithPath;
  onSelect: (verse: AnchorVerse) => void;
  selected?: AnchorVerse | null;
}

const verses: Record<FaithPath, AnchorVerse[]> = {
  christian: [
    {
      text: 'I have hidden your word in my heart that I might not sin against you.',
      reference: 'Psalm 119:11',
      type: 'christian',
      rating: 5,
    },
    {
      text: 'No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear.',
      reference: '1 Corinthians 10:13',
      type: 'christian',
      rating: 5,
    },
    {
      text: 'Create in me a pure heart, O God, and renew a steadfast spirit within me.',
      reference: 'Psalm 51:10',
      type: 'christian',
      rating: 4,
    },
    {
      text: 'Finally, brothers and sisters, whatever is true, whatever is noble, whatever is right, whatever is pure, whatever is lovely, whatever is admirable—if anything is excellent or praiseworthy—think about such things.',
      reference: 'Philippians 4:8',
      type: 'christian',
      rating: 5,
    },
  ],
  muslim: [
    {
      text: 'Tell the believing men to lower their gaze and guard their modesty.',
      reference: 'Quran 24:30',
      arabic: 'قُل لِّلْمُؤْمِنِينَ يَغُضُّوا مِنْ أَبْصَارِهِمْ',
      type: 'muslim',
      rating: 5,
    },
    {
      text: 'And whoever fears Allah - He will make for him a way out.',
      reference: 'Quran 65:2',
      arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
      type: 'muslim',
      rating: 5,
    },
    {
      text: 'Indeed, Allah loves those who are constantly repentant and loves those who purify themselves.',
      reference: 'Quran 2:222',
      arabic: 'إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ',
      type: 'muslim',
      rating: 4,
    },
  ],
  secular: [
    {
      text: 'Between stimulus and response there is a space. In that space is our power to choose our response. In our response lies our growth and our freedom.',
      reference: 'Viktor Frankl',
      type: 'secular',
      rating: 5,
    },
    {
      text: 'The best time to plant a tree was 20 years ago. The second best time is now.',
      reference: 'Chinese Proverb',
      type: 'secular',
      rating: 5,
    },
    {
      text: 'You have power over your mind - not outside events. Realize this, and you will find strength.',
      reference: 'Marcus Aurelius',
      type: 'secular',
      rating: 4,
    },
  ],
};

export function VerseSelector({ faithPath, onSelect, selected }: VerseSelectorProps) {
  const relevantVerses = verses[faithPath] || verses.secular;

  return (
    <ScrollView className="flex-1">
      {relevantVerses.map((verse, index) => (
        <TouchableOpacity
          key={index}
          className={`border-2 rounded-lg p-4 mb-4 ${
            selected?.reference === verse.reference
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200'
          }`}
          onPress={() => onSelect(verse)}
        >
          {verse.arabic && (
            <Text className="text-lg mb-2 text-right font-semibold">
              {verse.arabic}
            </Text>
          )}
          <Text className="text-base mb-2 leading-6">"{verse.text}"</Text>
          <Text className="text-sm text-gray-600 mb-2">— {verse.reference}</Text>
          {verse.rating && (
            <Text className="text-xs text-yellow-600 mt-2">
              {'⭐'.repeat(verse.rating)} Most helpful
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
