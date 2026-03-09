/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/escrow_engine.json`.
 */
export type EscrowEngine = {
    "address": "7Brc92uzycCySEN6Ma6G7qFRapDTkSiw7HZG2roqq2nb",
    "metadata": {
        "name": "escrowEngine",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
    },
    "instructions": [
        {
            "name": "cancel",
            "discriminator": [
                232,
                219,
                223,
                41,
                219,
                236,
                220,
                190
            ],
            "accounts": [
                {
                    "name": "maker",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "escrow",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    101,
                                    115,
                                    99,
                                    114,
                                    111,
                                    119
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "maker"
                            },
                            {
                                "kind": "account",
                                "path": "escrow.escrow_id",
                                "account": "escrow"
                            }
                        ]
                    }
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": []
        },
        {
            "name": "claim",
            "discriminator": [
                62,
                198,
                214,
                193,
                213,
                159,
                108,
                210
            ],
            "accounts": [
                {
                    "name": "receiver",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "escrow",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    101,
                                    115,
                                    99,
                                    114,
                                    111,
                                    119
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "escrow.maker",
                                "account": "escrow"
                            },
                            {
                                "kind": "account",
                                "path": "escrow.escrow_id",
                                "account": "escrow"
                            }
                        ]
                    }
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": []
        },
        {
            "name": "deposite",
            "discriminator": [
                118,
                208,
                149,
                217,
                247,
                221,
                23,
                107
            ],
            "accounts": [
                {
                    "name": "maker",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "escrow",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    101,
                                    115,
                                    99,
                                    114,
                                    111,
                                    119
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "maker"
                            },
                            {
                                "kind": "account",
                                "path": "escrow.escrow_id",
                                "account": "escrow"
                            }
                        ]
                    }
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": []
        },
        {
            "name": "initializeEscrow",
            "discriminator": [
                243,
                160,
                77,
                153,
                11,
                92,
                48,
                209
            ],
            "accounts": [
                {
                    "name": "maker",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "escrow",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    101,
                                    115,
                                    99,
                                    114,
                                    111,
                                    119
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "maker"
                            },
                            {
                                "kind": "arg",
                                "path": "escrowId"
                            }
                        ]
                    }
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "escrowId",
                    "type": "u64"
                },
                {
                    "name": "reciver",
                    "type": "pubkey"
                },
                {
                    "name": "amount",
                    "type": "u64"
                },
                {
                    "name": "deadline",
                    "type": "i64"
                },
                {
                    "name": "mint",
                    "type": {
                        "option": "pubkey"
                    }
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "escrow",
            "discriminator": [
                31,
                213,
                123,
                187,
                186,
                22,
                218,
                155
            ]
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "invalidAmount",
            "msg": "Escrow amount must be greater than zero."
        },
        {
            "code": 6001,
            "name": "invalidDeadline",
            "msg": "The provided deadline must be a future timestamp."
        },
        {
            "code": 6002,
            "name": "invalidState",
            "msg": "Escrow is in an invalid state for this operation."
        },
        {
            "code": 6003,
            "name": "invalidMaker",
            "msg": "Only the escrow maker is authorized to perform this action."
        },
        {
            "code": 6004,
            "name": "deadlinePassed",
            "msg": "The escrow deadline has already passed."
        },
        {
            "code": 6005,
            "name": "unauthorized",
            "msg": "The escrow amount only can receive receiver."
        },
        {
            "code": 6006,
            "name": "beforeDeadline",
            "msg": "The escrow amount can not be claimed before deadline"
        }
    ],
    "types": [
        {
            "name": "escrow",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "maker",
                        "type": "pubkey"
                    },
                    {
                        "name": "reciver",
                        "type": "pubkey"
                    },
                    {
                        "name": "mint",
                        "type": {
                            "option": "pubkey"
                        }
                    },
                    {
                        "name": "amount",
                        "type": "u64"
                    },
                    {
                        "name": "deadline",
                        "type": "i64"
                    },
                    {
                        "name": "escrowId",
                        "type": "u64"
                    },
                    {
                        "name": "bump",
                        "type": "u8"
                    },
                    {
                        "name": "status",
                        "type": {
                            "defined": {
                                "name": "escrowStatus"
                            }
                        }
                    }
                ]
            }
        },
        {
            "name": "escrowStatus",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "created"
                    },
                    {
                        "name": "funded"
                    },
                    {
                        "name": "claimed"
                    },
                    {
                        "name": "cancelled"
                    }
                ]
            }
        }
    ]
};
