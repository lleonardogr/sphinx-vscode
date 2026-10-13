#include <stdio.h>
#include <stdlib.h>
#include <math.h>

struct point {
    long x, y;          /* the coordinates are integers: exact arithmetic */
};

static struct point shape[100];
static int corners;

static long cross(struct point o, struct point a, struct point b) {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

/* Winding number: how many times the polygon winds around q. */
static int winding(struct point q) {
    int w = 0;
    for (int i = 0; i < corners; i++) {
        struct point a = shape[i], b = shape[(i + 1) % corners];
        if (a.y <= q.y) {
            if (b.y > q.y && cross(a, b, q) > 0) w++;
        } else if (b.y <= q.y && cross(a, b, q) < 0) {
            w--;
        }
    }
    return w;
}

int main(void) {
    scanf("%d", &corners);
    for (int i = 0; i < corners; i++) {
        scanf("%ld %ld", &shape[i].x, &shape[i].y);
    }
    long twice = 0;
    double around = 0;
    struct point origin = {0, 0};
    for (int i = 0; i < corners; i++) {
        struct point a = shape[i], b = shape[(i + 1) % corners];
        twice += cross(origin, a, b);
        around += sqrt((double) ((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y)));
    }
    printf("Area: %.2f\nPerimeter: %.2f\n", labs(twice) / 2.0, around);
    int q;
    scanf("%d", &q);
    while (q-- > 0) {
        struct point p;
        scanf("%ld %ld", &p.x, &p.y);
        printf("(%ld, %ld) %s\n", p.x, p.y, winding(p) != 0 ? "inside" : "outside");
    }
    return 0;
}
