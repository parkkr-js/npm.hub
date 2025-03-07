// components/package-detail/google-trends/index.tsx
'use client';
import { useEffect, useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  Label,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendsError } from '@/types/error';
import { CustomTooltip } from './CustomTooltip';
import { GoogletrendsAtom } from '@/store/atoms';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { GoogleTrendsProps, TrendsData } from '@/types/google-trends';
import { fetchGoogleTrends } from '@/app/api/google-trends/actions';
import { GoogleTrendsSkeleton } from '@/components/skeletons/GoogleTrendsSkeleton';
import { ErrorTrends } from './ErrorTrends';

export function GoogleTrends({ packageName }: GoogleTrendsProps) {
  const [trendsData, setTrendsData] = useState<TrendsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<TrendsError | null>(null);

  const setGoogleTrends = useSetRecoilState(GoogletrendsAtom);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchGoogleTrends(packageName);
        setTrendsData(data);

        if (data?.interest?.[52]?.value) {
          setGoogleTrends(data.interest[52].value[0]);
        } else {
          setGoogleTrends(null);
        }
      } catch (err) {
        const trendsError: TrendsError =
          err instanceof Error ? err : new Error('Failed to fetch google trends data');
        if (err instanceof Error && 'status' in err) {
          trendsError.status = (err as any).status;
        }
        setError(trendsError);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [packageName, setGoogleTrends]);

  const calculateAverage = useMemo(() => {
    if (!trendsData?.interest) return 0;
    const sum = trendsData.interest.reduce((acc, curr) => acc + curr.value[0], 0);
    return sum / trendsData.interest.length;
  }, [trendsData]);

  const calculateMax = useMemo(() => {
    if (!trendsData?.interest) return 0;
    const max = trendsData.interest.reduce((acc, curr) => Math.max(acc, curr.value[0]), 0);
    return max;
  }, [trendsData]);

  if (error) {
    return <ErrorTrends error={error} />;
  }

  if (isLoading) {
    return <GoogleTrendsSkeleton />;
  }

  if (!trendsData?.interest?.length) {
    return (
      <div className="w-[785px] bg-secondary-90 rounded-[20px] p-6 mb-6">
        <p className="text-xl font-semibold mb-2 text-[#ff000083]">
          We couldn’t find any google-trends information on this package. It may not be available
          yet.
        </p>
      </div>
    );
  }
  return (
    <>
      {trendsData?.interest?.length ? (
        <div className="w-[785px] h-full">
          <div className="w-full bg-secondary-90 rounded-[20px] p-6 mb-6">
            <p className="text-xl font-semibold mb-2 text-primary-50">
              Understanding Google Trends Scores
            </p>
            <p className="text-[#F6F6F6] mb-4">
              Numbers represent relative search interest where 100 is the peak popularity for the
              term. A value of 50 means it is half as popular, and 0 means insufficient data.
            </p>
          </div>
          <div className="h-auto bg-secondary-90 rounded-[20px] p-5 w-full">
            <p className="text-xl font-semibold mb-2 text-primary-50">Weekly download graph</p>
            <p className="text-[#F6F6F6] mb-4">
              A calendar module that is based on material design concepts.
            </p>

            <div className="h-[352px] w-[661px] ml-14 mt-3 rounded-[20px] bg-white">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendsData.interest}
                  margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="formattedTime"
                    angle={-45}
                    textAnchor="end"
                    height={90}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                    label={{
                      value: 'Search Interest',
                      angle: -90,
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' },
                    }}
                  />

                  <Tooltip
                    content={(props) => <CustomTooltip {...props} average={calculateAverage} />}
                  />
                  <Legend />

                  <ReferenceLine
                    y={calculateAverage}
                    stroke="#000000"
                    strokeDasharray="3 3"
                    label={{
                      value: 'Average',
                      position: 'left',
                      fill: '#000000',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  />

                  <Line
                    className="pt-2"
                    type="monotone"
                    dataKey={(d) => d.value[0]}
                    name="Interest"
                    stroke="#48494D"
                    strokeWidth={2}
                    dot={(props) => {
                      const isMax = props.value === calculateMax;
                      return isMax ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          x={props.cx - 7}
                          y={props.cy - 7}
                        >
                          <circle cx="7" cy="7" r="6.5" fill="#FF5449" stroke="#FF5449" />
                          <circle cx="7" cy="7" r="4.5" stroke="#F0F1F7" />
                        </svg>
                      ) : (
                        <circle cx={props.cx} cy={props.cy} r={0} fill="none" stroke="none" />
                      );
                    }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="text-sm pb-4 text-gray-500 flex justify-between items-center">
                <span>Data points: {trendsData.interest.length}</span>
                <span>{`${trendsData.interest[0].formattedAxisTime} - ${
                  trendsData.interest[trendsData.interest.length - 1].formattedAxisTime
                }`}</span>
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-[785px] bg-secondary-90 rounded-[20px] p-6 mb-6">
          <p className="text-xl font-semibold mb-2 text-[#ff000083]">
            We couldn’t find any google-trends information on this package. It may not be available
            yet.
          </p>
        </div>
      )}
    </>
  );
}
