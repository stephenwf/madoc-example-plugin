export function serverRendererFor(
    component: any,
    config: any
) {
    (component).getKey = config.getKey;
    (component).getData = config.getData;
}
