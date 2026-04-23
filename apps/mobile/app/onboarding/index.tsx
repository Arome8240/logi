import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/shared/components/ui';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STEPS = [
  {
    id: 0,
    title: 'Welcome',
    description: 'Get started with the best experience tailored just for you.',
    emoji: '👋',
  },
  {
    id: 1,
    title: 'Stay Organized',
    description: 'Keep track of everything in one place, effortlessly.',
    emoji: '📋',
  },
  {
    id: 2,
    title: "You're all set",
    description: 'Dive in and start exploring everything the app has to offer.',
    emoji: '🚀',
  },
];

function Dot({ active }: { active: boolean }) {
  const width = useSharedValue(active ? 24 : 8);
  const bg = useSharedValue(active ? 1 : 0);

  // sync on prop change
  width.value = withSpring(active ? 24 : 8, { damping: 18, stiffness: 200 });

  const style = useAnimatedStyle(() => ({
    width: width.value,
    height: 8,
    borderRadius: 4,
    backgroundColor: bg.value === 1 ? '#6366f1' : '#d1d5db',
  }));

  return <Animated.View style={style} />;
}

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <View className="flex-row gap-2 items-center justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <Dot key={i} active={i === current} />
      ))}
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const isAnimating = useRef(false);

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const goToStep = useCallback(
    (next: number, direction: 'forward' | 'back' = 'forward') => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const exitX = direction === 'forward' ? -SCREEN_WIDTH * 0.3 : SCREEN_WIDTH * 0.3;
      const enterX = direction === 'forward' ? SCREEN_WIDTH * 0.3 : -SCREEN_WIDTH * 0.3;

      opacity.value = withTiming(0, { duration: 180 });
      translateX.value = withTiming(exitX, { duration: 200 }, () => {
        runOnJS(setStep)(next);
        translateX.value = enterX;
        opacity.value = 0;
        translateX.value = withSpring(0, { damping: 20, stiffness: 180 });
        opacity.value = withTiming(1, { duration: 220 }, () => {
          runOnJS(() => { isAnimating.current = false; })();
        });
      });
    },
    [opacity, translateX]
  );

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      goToStep(step + 1, 'forward');
    } else {
      router.replace('/');
    }
  };

  const handleBack = () => {
    if (step > 0) goToStep(step - 1, 'back');
  };

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <View className="flex-1 px-6 pt-8 pb-6 justify-between">
        {/* Skip */}
        <View className="items-end">
          {!isLast && (
            <Pressable onPress={() => router.replace('/')} hitSlop={12}>
              <Text style={{ fontFamily: 'PlusJakartaSans_500Medium' }} className="text-zinc-400 text-sm">Skip</Text>
            </Pressable>
          )}
        </View>

        {/* Content */}
        <Animated.View style={animatedStyle} className="flex-1 justify-center items-center gap-6">
          <Text style={{ fontSize: 80 }}>{current.emoji}</Text>
          <Text
            style={{ fontFamily: 'PlusJakartaSans_700Bold' }}
            className="text-3xl text-center text-zinc-900 dark:text-zinc-50"
          >
            {current.title}
          </Text>
          <Text
            style={{ fontFamily: 'PlusJakartaSans_400Regular' }}
            className="text-base text-center text-zinc-500 dark:text-zinc-400 leading-relaxed px-4"
          >
            {current.description}
          </Text>
        </Animated.View>

        {/* Bottom */}
        <View className="gap-6">
          <StepDots total={STEPS.length} current={step} />

          <View className="flex-row gap-3">
            {step > 0 && (
              <Pressable
                onPress={handleBack}
                className="flex-1 h-14 rounded-2xl border border-zinc-200 dark:border-zinc-800 items-center justify-center"
              >
                <Text
                  style={{ fontFamily: 'PlusJakartaSans_600SemiBold' }}
                  className="text-zinc-700 dark:text-zinc-300"
                >
                  Back
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={handleNext}
              className="flex-1 h-14 rounded-2xl bg-indigo-500 items-center justify-center"
            >
              <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold' }} className="text-white">
                {isLast ? 'Get Started' : 'Next'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
