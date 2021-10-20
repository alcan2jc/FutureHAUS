/// <amd-module name="@tensorflow/tfjs-core/dist/hash_util" />
import Long from 'long';
export declare function hexToLong(hex: string): Long;
export declare function fingerPrint64(s: Uint8Array, len?: number): Long;
