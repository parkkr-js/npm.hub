import { SearchResult } from '@/types/google-search';
import { removeSpecialChars } from '@/lib/utils';
export async function fetchGoogleSearch(packageName: string): Promise<SearchResult[]> {
  //packageName = 'test-error-429';
  let modifiedPackageName = decodeURIComponent(packageName);
  modifiedPackageName = `npm ${modifiedPackageName}`;
  modifiedPackageName = removeSpecialChars(modifiedPackageName);

  const response = await fetch(`/api/google-search?q=${modifiedPackageName}`);

  // 테스트 모드: 패키지 이름에 따라 에러 시뮬레이션
  // 테스트용 코드이므로 프로덕션에서는 제거해야 합니다
  // if (packageName.includes('test-error')) {
  //   const errorType = packageName.split('test-error-')[1];
  //   const error = new Error();

  //   switch (errorType) {
  //     case '404':
  //       error.message = '검색 결과를 찾을 수 없습니다';
  //       (error as any).status = 404;
  //       throw error;
  //     case '403':
  //       error.message = 'API 키가 유효하지 않습니다';
  //       (error as any).status = 403;
  //       throw error;
  //     case '429':
  //       error.message = '호출 한도 초과';
  //       (error as any).status = 429;
  //       throw error;
  //     case '500':
  //       error.message = '서버 오류';
  //       (error as any).status = 500;
  //       throw error;
  //     case 'network':
  //       error.message = '네트워크 문제로 인해 데이터를 가져오지 못했습니다';
  //       throw error;
  //     default:
  //       // 일반 실행 계속
  //       break;
  //   }
  // }

  if (!response.ok) {
    const error = new Error(`API Error: ${response.status}`);
    (error as any).status = response.status;

    try {
      const errorData = await response.json();
      if (errorData && errorData.error) {
        error.message = errorData.error;
      }
    } catch (e) {
      console.error('Failed to parse error response:', e);
    }
    throw error;
  }

  const data = await response.json();

  if (!data.items || !Array.isArray(data.items)) {
    const error = new Error('No search results found');
    (error as any).status = 404;
    throw error;
  }

  return data.items.map((item: SearchResult) => ({
    title: item.title,
    link: item.link,
    snippet: item.snippet,
    displayLink: item.displayLink,
    thumbnail: item.thumbnail,
  }));
}
