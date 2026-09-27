var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SupabaseService_1;
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
let SupabaseService = SupabaseService_1 = class SupabaseService {
    configService;
    logger = new Logger(SupabaseService_1.name);
    supabaseClient;
    supabaseUrl;
    anonKey;
    constructor(configService) {
        this.configService = configService;
        this.supabaseUrl = this.configService.get('SUPABASE_URL') || '';
        this.anonKey = this.configService.get('SUPABASE_ANON_KEY') || '';
        if (!this.supabaseUrl || !this.anonKey) {
            this.logger.warn('SUPABASE_URL or SUPABASE_ANON_KEY is missing from environment variables.');
        }
        this.supabaseClient = createClient(this.supabaseUrl, this.anonKey);
    }
    getClient() {
        return this.supabaseClient;
    }
    getAuthenticatedClient(accessToken) {
        return createClient(this.supabaseUrl, this.anonKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        });
    }
};
SupabaseService = SupabaseService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], SupabaseService);
export { SupabaseService };
//# sourceMappingURL=supabase.service.js.map