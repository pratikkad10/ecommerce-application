import React, { useState, useEffect } from 'react';
import { getActiveCampaign } from '@/api/services/campaign.service';

interface CampaignData {
  title: string;
  highlightText: string;
  subtitle: string;
  description: string;
  bannerImageUrl: string;
  endDate: string;
}

export const Sale: React.FC = () => {
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await getActiveCampaign();
        if (res.success && res.data) {
          setCampaign(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch active campaign", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, []);

  useEffect(() => {
    if (!campaign?.endDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(campaign.endDate).getTime();
      const distance = end - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [campaign?.endDate]);

  const padZero = (num: number) => (num < 10 ? `0${num}` : num.toString());

  if (loading) {
    return <div className="grow w-full flex items-center justify-center py-20">Loading deals...</div>;
  }

  if (!campaign) {
    return <div className="grow w-full flex items-center justify-center py-20">No active campaigns at the moment.</div>;
  }

  return (
    <main className="grow w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter py-lg md:py-xl flex flex-col gap-xl">
      {/* Flash Sale Hero Banner */}
      <section className="relative rounded-xl overflow-hidden bg-surface-container-high shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between p-lg md:p-xl gap-lg">
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 100% 100%, var(--tw-colors-primary-container) 0%, transparent 50%)' }}
        ></div>

        <div className="relative z-10 flex flex-col gap-md max-w-[500px]">
          <div className="inline-flex items-center gap-2 bg-primary-container text-on-primary font-label-sm text-label-sm px-3 py-1 rounded-full w-fit">
            <span className="material-symbols-outlined text-[16px]" data-icon="local_fire_department">local_fire_department</span>
            FLASH SALE
          </div>

          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            {campaign.title} <span className="text-primary-container">{campaign.highlightText}</span> {campaign.subtitle}
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant">
            {campaign.description}
          </p>

          {/* Countdown Timer */}
          <div className="flex items-center gap-sm mt-sm">
            <div className="flex flex-col items-center bg-surface-container-lowest rounded-lg p-3 min-w-[70px] shadow-sm">
              <span className="font-headline-md text-headline-md text-primary font-black">{padZero(timeLeft.days)}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Days</span>
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface-variant">:</span>
            <div className="flex flex-col items-center bg-surface-container-lowest rounded-lg p-3 min-w-[70px] shadow-sm">
              <span className="font-headline-md text-headline-md text-primary font-black">{padZero(timeLeft.hours)}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Hrs</span>
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface-variant">:</span>
            <div className="flex flex-col items-center bg-surface-container-lowest rounded-lg p-3 min-w-[70px] shadow-sm">
              <span className="font-headline-md text-headline-md text-primary font-black">{padZero(timeLeft.minutes)}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Min</span>
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface-variant">:</span>
            <div className="flex flex-col items-center bg-surface-container-lowest rounded-lg p-3 min-w-[70px] shadow-sm">
              <span className="font-headline-md text-headline-md text-primary font-black">{padZero(timeLeft.seconds)}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Sec</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full md:w-1/2 h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-md">
          <div
            className="bg-cover bg-center w-full h-full transform hover:scale-105 transition-transform duration-700 ease-in-out"
            style={{ backgroundImage: `url('${campaign.bannerImageUrl}')` }}
          ></div>
        </div>
      </section>
    </main>
  );
};
