import type { TrendsError } from '@/types/error';

interface ErrorTrendsProps {
  error: TrendsError;
}
export function ErrorTrends({ error }: ErrorTrendsProps) {
  // HTTP 상태 코드에 따른 다른 메시지
  if (error.status === 404) {
    return (
      <div className="w-[785px] bg-secondary-90 rounded-[20px] p-6 mb-6">
        <p className="text-xl font-semibold mb-2 text-yellow-400">
          이 패키지에 대한 트렌드 결과를 찾을 수 없습니다.
        </p>
        <p className="text-sm text-secondary-40">
          다른 키워드를 사용하거나 패키지 이름을 확인해 보세요.
        </p>
      </div>
    );
  }
  if (error.status === 403 || error.message.includes('API Key')) {
    return (
      <div className="w-[785px] bg-secondary-90 rounded-[20px] p-6 mb-6">
        <p className="text-xl font-semibold mb-2 text-orange-400">API 접근 문제</p>
        <p className="text-sm text-secondary-40">
          검색 서비스에 문제가 발생했습니다. 나중에 다시 시도해 주세요.
        </p>
      </div>
    );
  }
  if (error.status === 429) {
    return (
      <div className="w-[785px] bg-secondary-90 rounded-[20px] p-6 mb-6">
        <p className="text-xl font-semibold mb-2 text-purple-400">요청 한도 초과</p>
        <p className="text-sm text-secondary-40">
          API 한도에 도달했습니다. 몇 분 후에 다시 시도해 주세요.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-secondary-60 text-white rounded-md hover:bg-secondary-50 transition-colors"
          type="button"
        >
          다시 시도
        </button>
      </div>
    );
  }
  if (error.status === 500) {
    return (
      <div className="w-[785px] bg-secondary-90 rounded-[20px] p-6 mb-6">
        <p className="text-xl font-semibold mb-2 text-red-500">서버 오류</p>
        <p className="text-sm text-secondary-40">
          검색 서비스에 기술적인 문제가 발생했습니다. 우리 팀에 통보되었습니다.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-secondary-60 text-white rounded-md hover:bg-secondary-50 transition-colors"
          type="button"
        >
          다시 시도
        </button>
      </div>
    );
  }
}
