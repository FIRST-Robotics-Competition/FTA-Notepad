<script lang="ts">
    import { Icon, XMark, type IconSource } from "svelte-hero-icons";
    import { twMerge } from "tailwind-merge";
    
    interface ModalProps {
        open: boolean;
        title?: string;
        size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "fit";
        dismissable?: boolean;
        outsideclose?: boolean;
        icon?: IconSource;
        iconColor?: "primary" | "red" | "green" | "blue";
        fixed?: boolean;
        modalClass?: string;
        modalOpenClass?: { open: string; close: string };
        containerClass?: string;
        class?: string;
        children: any;
    }

    let {
        open = $bindable(false),
        title = "",
        size = "fit",
        dismissable = false,
        outsideclose = false,
        icon,
        iconColor = "primary",
        fixed = false,
        modalClass = "relative transform overflow-hidden rounded-lg bg-white dark:bg-neutral-700 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:p-6 w-full",
        modalOpenClass = {
            open: "opacity-100 translate-y-0 sm:scale-100 ease-out duration-300",
            close: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 ease-in duration-200",
        },
        containerClass = "h-full",
        children,
        ...restProps
    }: ModalProps = $props();

    const iconBGColors = {
        primary: "bg-primary-100",
        red: "bg-red-100",
        green: "bg-green-100",
        blue: "bg-blue-100",
    };

    const iconFGColors = {
        primary: "text-primary-600",
        red: "text-red-600",
        green: "text-green-600",
        blue: "text-blue-600",
    };

    const sizeClass = {
        xs: "max-w-sm",
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        "2xl": "max-w-6xl",
        fit: "w-fit",
    };

    function backdropClick(e: Event) {
        const target = e.target as HTMLElement;
        if (dismissable && outsideclose && target.id === `${id}-wrapper`) {
            //$host().dispatchEvent(new CustomEvent("close"));
            open = false;
        }
    }

    const id = crypto.randomUUID();
</script>

<svelte:window on:keydown={e => {
    if (e.key === "Escape" && dismissable) {
        //$host().dispatchEvent(new CustomEvent("close"));
        open = false;
    }
}} />

<div
    {...restProps}
    class="relative z-10 {open ? 'visible' : 'collapse'}"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
>
    <div
        class="fixed inset-0 z-10 bg-gray-500 dark:bg-neutral-800 bg-opacity-75 transition-opacity {open
            ? 'opacity-75 ease-out duration-300'
            : 'opacity-0 ease-in duration-200'}"
    ></div>

    <div class="fixed z-20 inset-0 overflow-y-auto">
        <div
            id="{id}-wrapper"
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
            onclick={backdropClick}
            role="presentation"
        >
            <div
                id="{id}-modal"
                class={twMerge(
                    modalClass,
                    sizeClass[size],
                    fixed ? "absolute top-0" : "",
                    open ? modalOpenClass.open : modalOpenClass.close,
                    restProps.class
                )}
            >
                {#if dismissable}
                    <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                        <button
                            type="button"
                            class="rounded-md text-gray-400 dark:text-white hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onclick={() => {
                                //$host().dispatchEvent(new CustomEvent("close"));
                                open = false;
                            }}
                        >
                            <span class="sr-only">Close</span>
                            <Icon src={XMark} class="h-6 w-6" />
                        </button>
                    </div>
                {/if}
                <div class="sm:flex sm:items-start h-full {icon && 'pr-12'}">
                    {#if icon}
                        <div
                            class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center {iconBGColors[
                                iconColor
                            ]} rounded-full sm:mx-0 sm:h-10 sm:w-10"
                        >
                            <Icon src={icon} class="h-6 w-6 {iconFGColors[iconColor]}" />
                        </div>
                    {/if}
                    <div
                        class={twMerge(
                            "mt-3 text-center sm:mt-0 sm:text-left w-full",
                            icon && "sm:ml-4",
                            containerClass
                        )}
                    >
                        {#if title}<h3
                                class="text-base font-semibold leading-6"
                                id="modal-title"
                            >
                                {title}
                            </h3>{/if}
                        <div class="{title ? 'mt-2' : ''} h-full"> <!--{children().footer && 'pb-8'}"> -->
                            {@render children()}
                        </div>
                    </div>
                </div>
                <!-- {#if children().footer}
                    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        {@render children()}
                    </div>
                {/if} -->
            </div>
        </div>
    </div>
</div>
