<script lang="ts">
    import { twMerge } from "tailwind-merge";

    interface ButtonProps {
        href?: string;
        type?: "button" | "reset" | "submit";
        color?: keyof typeof colorClass;
        inline?: boolean;
        disabled?: boolean;
        class?: string;
        defaultClass?: string;
        children: any;
    }

    let { 
        href, 
        type = "button", 
        color = "primary", 
        inline = true, 
        disabled = false,
        defaultClass = "items-center justify-center gap-x-2 rounded-lg px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-gray-100 p-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        children,
        ...restProps 
    }: ButtonProps = $props();

    let colorClass = {
        none: "",
        primary: "bg-primary-500 hover:bg-primary-600 text-white focus-visible:bg-primary-500",
        blue: "bg-blue-500 hover:bg-blue-600 text-white focus-visible:bg-blue-500",
        red: "bg-red-500 hover:bg-red-600 text-white focus-visible:bg-red-500",
        green: "bg-green-500 hover:bg-green-600 text-white focus-visible:bg-green-500",
        yellow: "bg-yellow-500 hover:bg-yellow-600 text-white focus-visible:bg-yellow-500",
        gray: "bg-gray-500 hover:bg-gray-600 text-white focus-visible:bg-gray-500",
        dark: "bg-gray-800 hover:bg-gray-900 text-white focus-visible:bg-gray-800",
        white: "bg-white hover:bg-gray-100 text-black focus-visible:bg-white",
    }

    let buttonClass = "";
    buttonClass = twMerge(
        defaultClass,
        inline ? "inline-flex" : "",
        colorClass[color],
        disabled && "cursor-not-allowed opacity-50",
        restProps.class,
    );
</script>

{#if href}
    <a
        {href}
        {...restProps}
        class={buttonClass}
        role="button"
    >
        {@render children()}
    </a>
{:else}
    <button
        {type}
        {...restProps}
        class={buttonClass}
    >
        {@render children()}
    </button>
{/if}
