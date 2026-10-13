#include <stdio.h>

/* One grid: bit 0 is the cell now, bit 1 is the cell in the next generation. */
static unsigned char cell[50][50];
static int rows, cols;

static int now(int r, int c) {
    return r >= 0 && r < rows && c >= 0 && c < cols ? cell[r][c] & 1 : 0;
}

int main(void) {
    int generations;
    scanf("%d %d %d", &rows, &cols, &generations);
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            char ch;
            scanf(" %c", &ch);
            cell[r][c] = ch == '#';
        }
    }
    while (generations-- > 0) {
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                int n = 0;
                for (int dr = -1; dr <= 1; dr++) {
                    for (int dc = -1; dc <= 1; dc++) {
                        n += (dr || dc) ? now(r + dr, c + dc) : 0;
                    }
                }
                if (n == 3 || (n == 2 && (cell[r][c] & 1))) {
                    cell[r][c] |= 2;
                }
            }
        }
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                cell[r][c] >>= 1;
            }
        }
    }
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            putchar(cell[r][c] ? '#' : '.');
        }
        putchar('\n');
    }
    return 0;
}
