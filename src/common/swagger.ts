import { OpenAPIV3 } from 'openapi-types';

export const swaggerDocument: OpenAPIV3.Document = {
    openapi: '3.0.0',
    info: {
        title: 'Express API with Swagger',
        version: '1.0.0',
        description: 'A simple Express API',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
    ],
    paths: {
        '/api/v1/heart-rate': {
            post: {
                summary: 'Process heart rate data',
                description: 'Process heart rate data',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/data'
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/data'
                                },
                            },
                        },
                    }
                },

            },
        },
    },
    components: {
        schemas: {
            output: {
                type: 'object',
                required: ['patient_id', 'from_healthkit_sync', 'orgId'],
                properties: {
                    patient_id: {
                        type: 'string',
                    },
                    from_healthkit_sync: {
                        type: 'boolean',
                    },
                    orgId: {
                        type: 'string',
                    },
                    clinical_data: {
                        type: 'object',
                        properties: {
                            HEART_RATE: {
                                type: 'object',
                                required: ['name', 'uom'],
                                properties: {
                                    name: {
                                        type: 'string',
                                    },
                                    uom: {
                                        type: 'string',
                                    },
                                    data: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                on_date : {type: 'string'},
                                                measurement : {type: 'string'},
                                            }
                                        }
                                    },
                                    aggregatedData: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                from_date : {type: 'string'},
                                                to_date : {type: 'string'},
                                                min : {type: 'string'},
                                                max : {type: 'string'},
                                            }
                                        }
                                    },
                                }
                            },
                            WEIGHT: {
                                type: 'object',
                                required: ['name', 'uom'],
                                properties: {
                                    name: {
                                        type: 'string',
                                    },
                                    uom: {
                                        type: 'string',
                                    },
                                    data: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                on_date : {type: 'string'},
                                                measurement : {type: 'string'},
                                            }
                                        }
                                    },
                                }
                            },
                            BLOOD_GLUCOSE_LEVELS: {
                                type: 'object',
                                required: ['name', 'uom'],
                                properties: {
                                    name: {
                                        type: 'string',
                                    },
                                    uom: {
                                        type: 'string',
                                    },
                                    data: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                on_date : {type: 'string'},
                                                measurement : {type: 'string'},
                                            }
                                        }
                                    },
                                }
                            },
                            HEIGHT: {
                                type: 'object',
                                required: ['name', 'uom'],
                                properties: {
                                    name: {
                                        type: 'string',
                                    },
                                    uom: {
                                        type: 'string',
                                    },
                                    data: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                on_date : {type: 'string'},
                                                measurement : {type: 'string'},
                                            }
                                        }
                                    },
                                }
                            },
                            BP: {
                                type: 'object',
                                required: ['name', 'uom'],
                                properties: {
                                    name: {
                                        type: 'string',
                                    },
                                    uom: {
                                        type: 'string',
                                    },
                                    data: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                on_date : {type: 'string'},
                                                measurement : {type: 'string'},
                                            }
                                        }
                                    },
                                }
                            },
                            STEPS: {
                                type: 'object',
                                required: ['name', 'uom'],
                                properties: {
                                    name: {
                                        type: 'string',
                                    },
                                    uom: {
                                        type: 'string',
                                    },
                                    data: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                on_date : {type: 'string'},
                                                measurement : {type: 'string'},
                                            }
                                        }
                                    },
                                }
                            },
                        }
                    }
                },
            },
            data: {
                type: 'object',
                required: ['patient_id', 'from_healthkit_sync', 'orgId'],
                properties: {
                    patient_id: {
                        type: 'string',
                    },
                    from_healthkit_sync: {
                        type: 'boolean',
                    },
                    orgId: {
                        type: 'string',
                    },
                    clinical_data: {
                        type: 'object',
                        properties: {
                            HEART_RATE: {
                                type: 'object',
                                required: ['name', 'uom'],
                                properties: {
                                    name: {
                                        type: 'string',
                                    },
                                    uom: {
                                        type: 'string',
                                    },
                                    data: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                on_date : {type: 'string'},
                                                measurement : {type: 'string'},
                                            }
                                        }
                                    },
                                }
                            },
                            WEIGHT: {
                                type: 'object',
                                required: ['name', 'uom'],
                                properties: {
                                    name: {
                                        type: 'string',
                                    },
                                    uom: {
                                        type: 'string',
                                    },
                                    data: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                on_date : {type: 'string'},
                                                measurement : {type: 'string'},
                                            }
                                        }
                                    },
                                }
                            },
                            BLOOD_GLUCOSE_LEVELS: {
                                type: 'object',
                                required: ['name', 'uom'],
                                properties: {
                                    name: {
                                        type: 'string',
                                    },
                                    uom: {
                                        type: 'string',
                                    },
                                    data: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                on_date : {type: 'string'},
                                                measurement : {type: 'string'},
                                            }
                                        }
                                    },
                                }
                            },
                            HEIGHT: {
                                type: 'object',
                                required: ['name', 'uom'],
                                properties: {
                                    name: {
                                        type: 'string',
                                    },
                                    uom: {
                                        type: 'string',
                                    },
                                    data: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                on_date : {type: 'string'},
                                                measurement : {type: 'string'},
                                            }
                                        }
                                    },
                                }
                            },
                            BP: {
                                type: 'object',
                                required: ['name', 'uom'],
                                properties: {
                                    name: {
                                        type: 'string',
                                    },
                                    uom: {
                                        type: 'string',
                                    },
                                    data: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                on_date : {type: 'string'},
                                                measurement : {type: 'string'},
                                            }
                                        }
                                    },
                                }
                            },
                            STEPS: {
                                type: 'object',
                                required: ['name', 'uom'],
                                properties: {
                                    name: {
                                        type: 'string',
                                    },
                                    uom: {
                                        type: 'string',
                                    },
                                    data: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                on_date : {type: 'string'},
                                                measurement : {type: 'string'},
                                            }
                                        }
                                    },
                                }
                            },
                        }
                    }
                },
            },
        },
    }
};