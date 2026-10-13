#include <stdio.h>

#define MAX 50

static char grid[MAX][MAX], next[MAX][MAX];
static int rows, cols;

static int alive(int r, int c) {
    return r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] == '#';
}

static int neighbours(int r, int c) {
    int count = 0;
    for (int dr = -1; dr <= 1; dr++) {
        for (int dc = -1; dc <= 1; dc++) {
            if ((dr != 0 || dc != 0) && alive(r + dr, c + dc)) {
                count++;
            }
        }
    }
    return count;
}

int main(void) {
    int generations;
    scanf("%d %d %d", &rows, &cols, &generations);
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            scanf(" %c", &grid[r][c]);
        }
    }
    for (int g = 0; g < generations; g++) {
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                int n = neighbours(r, c);
                next[r][c] = (n == 3 || (n == 2 && grid[r][c] == '#')) ? '#' : '.';
            }
        }
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                grid[r][c] = next[r][c];
            }
        }
    }
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            putchar(grid[r][c]);
        }
        putchar('\n');
    }
    return 0;
}
