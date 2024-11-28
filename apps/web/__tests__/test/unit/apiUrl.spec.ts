import { describe, expect, it } from 'vitest'
import { removeTrailingSlash } from '../../../utils/pathHelper';

describe('removeTrailingSlash function', () => {
    const expectedApiUrl = 'http://localhost:8181';

    it('should remove one trailing slash', () => {
        const apiUrl = `${expectedApiUrl}/`;
        expect(removeTrailingSlash(apiUrl)).toEqual(expectedApiUrl);
    });

    it('should remove multiple trailing slashes', () => {
        const apiUrl = `${expectedApiUrl}/\//`;
        expect(removeTrailingSlash(apiUrl)).toEqual(expectedApiUrl);
    });

    it('should return the same URL if there is no trailing slash', () => {
        const apiUrl = expectedApiUrl;
        expect(removeTrailingSlash(apiUrl)).toEqual(apiUrl);
    });
});
