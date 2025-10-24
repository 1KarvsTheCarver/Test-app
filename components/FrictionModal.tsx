import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Button } from './Button';

interface FrictionModalProps {
  visible: boolean;
  onContinue: () => void;
  onGoBack: () => void;
  anchorVerse?: {
    text: string;
    reference: string;
  };
}

export function FrictionModal({
  visible,
  onContinue,
  onGoBack,
  anchorVerse
}: FrictionModalProps) {
  const [countdown, setCountdown] = useState(10);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    if (visible) {
      setCountdown(10);
      setCanContinue(false);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanContinue(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View className="flex-1 bg-black/80 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-md">
          <Text className="text-2xl font-bold text-center mb-4">
            ⏸️ Pause & Reflect
          </Text>

          {anchorVerse && (
            <View className="bg-blue-50 p-4 rounded-lg mb-6">
              <Text className="text-base italic mb-2">
                "{anchorVerse.text}"
              </Text>
              <Text className="text-sm text-gray-600">
                — {anchorVerse.reference}
              </Text>
            </View>
          )}

          <Text className="text-lg text-center mb-4">
            Is this aligned with your goals?
          </Text>

          <View className="bg-gray-100 rounded-lg p-4 mb-6">
            <Text className="text-center text-gray-700 mb-2">
              Take a moment to reconsider...
            </Text>
            {!canContinue && (
              <Text className="text-center text-2xl font-bold text-blue-600">
                {countdown}s
              </Text>
            )}
          </View>

          <View className="space-y-3">
            <Button
              title="🏆 Go Back (Recommended)"
              onPress={onGoBack}
              variant="primary"
            />

            <Button
              title={canContinue ? "Continue Anyway" : `Wait ${countdown}s...`}
              onPress={onContinue}
              variant="outline"
              disabled={!canContinue}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
