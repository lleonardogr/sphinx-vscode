#include <stdio.h>
#include <string.h>

int main(void) {
    int h, w, gens;
    scanf("%d %d %d", &h, &w, &gens);
    /* A border of dead cells around the grid: no bounds checks needed. */
    int now[52][52] = {{0}}, later[52][52] = {{0}};
    for (int r = 1; r <= h; r++) {
        for (int c = 1; c <= w; c++) {
            char ch;
            scanf(" %c", &ch);
            now[r][c] = ch == '#';
        }
    }
    while (gens-- > 0) {
        for (int r = 1; r <= h; r++) {
            for (int c = 1; c <= w; c++) {
                int n = now[r-1][c-1] + now[r-1][c] + now[r-1][c+1]
                      + now[r][c-1]                 + now[r][c+1]
                      + now[r+1][c-1] + now[r+1][c] + now[r+1][c+1];
                later[r][c] = n == 3 || (n == 2 && now[r][c]);
            }
        }
        memcpy(now, later, sizeof now);
    }
    for (int r = 1; r <= h; r++) {
        for (int c = 1; c <= w; c++) {
            printf("%c", now[r][c] ? '#' : '.');
        }
        printf("\n");
    }
    return 0;
}
